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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
                <p className="mb-6 text-gray-600">{form.description}</p>

                {form.questions.map((question, index) => (
                    <div key={question.id} className="mb-6 ">
                        <p className="font-semibold mb-2">
                            {index + 1}. {question.questionTitle}
                            {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </p>

                        {/* ラジオボタン */}
                        {question.questionType === "ラジオボタン" &&
                            question.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="radio"
                                        name={question.id}
                                        onChange={() =>
                                            updateAnswer(question.id, opt)
                                        }
                                    />
                                    <span className="ml-2">{opt}</span>
                                </label>
                            ))}

                        {/* チェックボックス */}
                        {question.questionType === "チェックボックス" &&
                            question.options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            updateAnswer(question.id, opt);
                                        }}
                                    />
                                    <span className="ml-2">{opt}</span>
                                </label>
                            ))}

                        {/* プルダウン */}
                        {question.questionType === "プルダウン" && (
                            <select
                                className="w-full border p-2 rounded"
                                onChange={(e) =>
                                    updateAnswer(question.id, e.target.value)
                                }
                            >
                                <option value="">選択してください</option>
                                {question.options.map((opt, i) => (
                                    <option key={i} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* テキスト */}
                        {question.questionType === "テキスト" && (
                            <textarea
                                className="w-full border p-2 rounded"
                                onChange={(e) =>
                                    updateAnswer(question.id, e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className={`w-full text-white py-3 rounded ${
                        form.published
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!form.published}
                >
                    {form.published ? "回答を送信" : "アンケートは非公開です"}
                </button>
            </div>
        </div>
    );
};

export default Answer;
