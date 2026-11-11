import { useParams } from "react-router-dom";
import {
    doc,
    getDocs,
    addDoc,
    collection,
    query,
    where,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import { db, auth, signInAnonymously } from "../firebase";
import { useEffect, useState } from "react";

// コンポーネント
import AnswerView from "../components/AnswerView";

const Answer = () => {
    const { formId } = useParams();

    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    // 回答済みかどうか
    const [voted, setVoted] = useState(false);
    const [uid, setUid] = useState(null);

    // フォームデータを取得するuseEffect
    useEffect(() => {
        // refとは参照の意味
        const docRef = doc(db, "forms", formId);

        const unsubscribe = onSnapshot(docRef, (snap) => {
            // snap は略語で、正式にはDocumentSnapshot（ドキュメントの写し）を指します。

            if (snap.exists()) {
                setForm({ id: snap.id, ...snap.data() });
                console.log("フォームデータ更新:", snap.data());
            }
        });
        // コンポーネントが消えたら監視解除
        return () => unsubscribe();
    }, [formId]);

    // ユーザーIDを取得するuseEffect
    useEffect(() => {
        // ------------- 以下二重投票を防ぐためのロジック -------------
        // 匿名ログイン
        if (!auth.currentUser) {
            signInAnonymously(auth)
                .then(() => {
                    console.log("匿名ログイン成功:", auth.currentUser.uid);
                    setUid(auth.currentUser.uid);
                })
                .catch((err) => alert(err.message));
        }
    }, []);

    // 一人一回答の制限がある場合、既に回答済みか確認するuseEffect
    useEffect(() => {
        if (!uid) return;
        if (!form) return;
        if (!form.restrictToOneResponse) {
            return;
        }

        // 既に回答済みか確認
        const checkVoted = async () => {
            const q = query(
                collection(db, "answers"),
                // 同じフォームIDかつ同じユーザーIDの回答を検索
                where("formId", "==", formId),
                where("userId", "==", uid),
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                setVoted(true);
            } else {
                setVoted(false);
            }
        };

        checkVoted();
    }, [formId, uid, form]);

    // 回答を更新する関数
    const updateAnswer = (questionId, value, checked) => {
        setAnswers((prev) => {
            // 自由記述の回答を保存する場合
            if (checked === "other") {
                return {
                    ...prev,
                    [`${questionId}_other`]: value,
                };
            }

            // ラジオ/プルダウン/テキストは単一回答として保存（checked が undefined の場合）
            if (typeof checked === "undefined") {
                // その他の回答とは別の箱で保存しておくことで、後で「その他」の回答を表示する際に便利
                const newAnswers = {
                    ...prev,
                    [questionId]: value, // questionId をキーにして値を保存
                };
                // 「その他」以外を選択したら自由記述を削除
                if (value !== "その他") {
                    delete newAnswers[`${questionId}_other`];
                }

                return newAnswers;
            }

            // チェックボックスの場合：配列で管理
            const current = Array.isArray(prev[questionId])
                ? prev[questionId]
                : [];

            // チェックを入れた場合
            if (checked) {
                // 追加（重複防止）
                if (current.includes(value)) return prev;
                return { ...prev, [questionId]: [...current, value] };
            }
            // チェックを外した場合
            const newAnswers = {
                ...prev,
                [questionId]: current.filter((v) => v !== value),
            };

            // 「その他」のチェックを外したら自由記述も削除
            if (value === "その他") {
                delete newAnswers[`${questionId}_other`];
            }

            return newAnswers;
        });
    };

    // 回答を更新する関数
    const handleSubmit = async () => {
        if (!form.published) {
            return alert("このアンケートは現在公開されていません。");
        }

        // 必須項目の入力チェック
        const unansweredRequired = form.questions.filter((question) => {
            if (!question.required) return false;

            const answer = answers[question.id];

            // 未回答チェック
            if (answer === undefined || answer === null || answer === "") {
                return true;
            }

            // チェックボックスの場合：1つも選択されていない
            if (Array.isArray(answer) && answer.length === 0) {
                return true;
            }

            // その他を選択しているのに自由記述が空欄
            if (Array.isArray(answer) && answer.includes("その他")) {
                return !answers[`${question.id}_other`]?.trim();
            }

            // ラジオボタンでその他を選択している場合
            if (answer === "その他") {
                return !answers[`${question.id}_other`]?.trim();
            }

            // テキスト回答で空白だけの場合
            if (typeof answer === "string" && !answer.trim()) {
                return true;
            }

            return false;
        });

        if (unansweredRequired.length > 0) {
            return alert("必須項目が入力されていません。");
        }

        if (Object.keys(answers).length === 0) {
            return alert("回答が入力されていません。");
        }

        if (!auth.currentUser) {
            return alert(
                "ログイン状態を確認できません。再度ページを読み込んでください。",
            );
        }

        if (voted) {
            return alert("既に回答済みです。");
        }

        // Firestore に回答を保存
        await addDoc(collection(db, "answers"), {
            formId,
            userId: uid,
            answers,
            votedAt: serverTimestamp(),
        });

        alert("回答を送信しました！");
        setVoted(true);
    };

    if (!form) {
        return <div className="p-6 text-center">読み込み中...</div>;
    }

    return (
        <AnswerView
            form={form}
            answers={answers}
            updateAnswer={updateAnswer}
            handleSubmit={handleSubmit}
            Preview={false}
            voted={voted}
        />
    );
};
export default Answer;
