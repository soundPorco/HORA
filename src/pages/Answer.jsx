import { useParams } from "react-router-dom";
import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
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

        fetchForm();
    }, [formId]);

    // 回答を更新する関数
    const updateAnswer = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value, // questionId をキーにして値を保存
        }));
    };

    // 回答を更新する関数
    const handleSubmit = async () => {
        if (!form.published) {
            alert("このアンケートは現在公開されていません。");
            return;
        }

        await addDoc(collection(db, "answers"), {
            formId,
            userId: auth.currentUser?.uid ?? null,
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
        />
    );
};
export default Answer;
