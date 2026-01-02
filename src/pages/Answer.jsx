import { useParams } from "react-router-dom";
import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth, signInAnonymously } from "../firebase";
import { useEffect, useState } from "react";

// コンポーネント
import AnswerView from "../components/AnswerView";

const Answer = () => {
    const { formId } = useParams();

    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchForm = async () => {
            // refとは参照の意味
            const docRef = doc(db, "forms", formId);
            // ↓↓↓Firestoreからデータが返ってくるまで 待ってから 次へ進む
            const snap = await getDoc(docRef);
            // snap は略語で、正式にはDocumentSnapshot（ドキュメントの写し）を指します。

            if (snap.exists()) {
                setForm(snap.data());
                console.log("フォームデータ:", snap.data());
            }
        };

        if (!auth.currentUser) {
            signInAnonymously(auth)
                .then(() => {
                    console.log("匿名ログイン成功:", auth.currentUser.uid);
                })
                .catch((err) => alert(err.message));
        }

        fetchForm();
    }, [formId]);

    // 回答を更新する関数
    const updateAnswer = (questionId, value, checked) => {
        setAnswers((prev) => {
            // checked が undefined の場合（ラジオ/プルダウン/テキスト等）は単一回答として保存
            if (typeof checked === "undefined") {
                return {
                    ...prev,
                    [questionId]: value, // questionId をキーにして値を保存
                };
            }

            // checkbox：配列で管理
            const current = Array.isArray(prev[questionId])
                ? prev[questionId]
                : [];

            if (checked) {
                // 追加（重複防止）
                if (current.includes(value)) return prev;
                return { ...prev, [questionId]: [...current, value] };
            } else {
                // 削除
                return {
                    ...prev,
                    [questionId]: current.filter((v) => v !== value),
                };
            }
        });
    };

    // 回答を更新する関数
    const handleSubmit = async () => {
        if (!form.published) {
            return alert("このアンケートは現在公開されていません。");
        }

        if (Object.keys(answers).length === 0) {
            return alert("回答が入力されていません。");
        }

        if (!auth.currentUser) {
            return alert(
                "ログイン状態を確認できません。再度ページを読み込んでください。"
            );
        }
        const uid = auth.currentUser.uid;

        // 既に回答済みか確認
        const q = query(
            collection(db, "answers"),
            // 同じフォームIDかつ同じユーザーIDの回答を検索
            where("formId", "==", formId),
            where("userId", "==", uid)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
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
    };

    if (!form) {
        return <div className="p-6 text-center">読み込み中...</div>;
    }

    return (
        <AnswerView
            form={form}
            updateAnswer={updateAnswer}
            handleSubmit={handleSubmit}
            Preview={false}
        />
    );
};
export default Answer;
