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
            }
        };

        fetchForm();
    }, [formId]);

    // 回答を更新する関数
    const updateAnswer = (questionId, value) => {
        setAnswers((prev) => {
            const exists = prev.find((a) => a.questionId === questionId);

            if (exists) {
                return prev.map((a) =>
                    a.questionId === questionId ? { ...a, value } : a
                );
            }

            return [...prev, { questionId, value }];
        });
    };

    // 回答を更新する関数
    const handleSubmit = async () => {
        await addDoc(collection(db, "answers"), {
            formId,
            userId: auth.currentUser?.uid ?? null,
            answers,
            createdAt: serverTimestamp(),
        });

        alert("回答を送信しました！");
    };

    if (!form) {
        return <div className="p-6 text-center">読み込み中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
                <p className="mb-6 text-gray-600">{form.description}</p>

                {form.questions.map((q, index) => (
                    <div key={q.id} className="mb-6">
                        <p className="font-semibold mb-2">
                            {index + 1}. {q.questionTitle}
                            {q.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </p>

                        {/* ラジオボタン */}
                        {q.questionType === "ラジオボタン" &&
                            q.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        onChange={() => updateAnswer(q.id, opt)}
                                    />
                                    <span className="ml-2">{opt}</span>
                                </label>
                            ))}

                        {/* チェックボックス */}
                        {q.questionType === "チェックボックス" &&
                            q.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            updateAnswer(q.id, opt);
                                        }}
                                    />
                                    <span className="ml-2">{opt}</span>
                                </label>
                            ))}

                        {/* テキスト */}
                        {q.questionType === "テキスト" && (
                            <textarea
                                className="w-full border p-2 rounded"
                                onChange={(e) =>
                                    updateAnswer(q.id, e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
                >
                    送信
                </button>
            </div>
        </div>
    );
};

export default Answer;
