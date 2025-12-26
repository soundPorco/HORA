// src/pages/Create.jsx
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化をインポート
import { useOutletContext } from "react-router-dom";
import autosize from "autosize";

// コンポーネント
import Questions from "../components/Questions";
import AddQuestionBtn from "../components/AddQuestionBtn";

const Create = () => {
    const { formData } = useOutletContext() || {};
    const formId = formData.id;

    // formId が undefined → 新規作成
    // フォームのタイトルと説明
    const [localFormData, setLocalFormData] = useState({
        userId: null,
        published: false,
        title: "",
        description: "",
        questions: [],
        // createdAt: null,
        updatedAt: null,
    });

    // ユーザーIDを取得してformDataにセット
    useEffect(() => {
        setLocalFormData(formData);
    }, [formData]);

    // フォームデータをFirestoreに保存する関数
    const saveFormData = async () => {
        const ref = doc(db, "forms", formId);
        try {
            await updateDoc(ref, {
                ...localFormData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("フォームの保存中にエラーが発生しました:", error);
        }

        setLocalFormData(localFormData);
        alert("フォームを保存しました");
    };

    // 設問を更新する関数（後で Question → Questions → Create の順で渡す）
    const updateQuestionData = (id, newData) => {
        setLocalFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((question) =>
                question.id === id ? newData : question
            ),
        }));
    };

    // 設問を追加する関数
    const addQuestion = () => {
        const newQuestion = {
            id: crypto.randomUUID(), // 一意のID
            questionTitle: "", // 設問のタイトル（質問文）
            questionType: "ラジオボタン", // 質問の種類（例: text, radio, checkbox）
            options: ["", ""], // 選択肢（typeが選択式の場合のみ使用）
            required: false, // 必須項目かどうか
        };
        setLocalFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    // 設問削除
    const deleteQuestion = (id) => {
        setLocalFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    // 自動でテキストエリアの高さを調整するための設定
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);

    return (
        <div>
            {/* アンケート作成フォーム */}
            <div className="bg-slate-200 shadow-md rounded-lg p-6 mx-auto w-[min(calc(100%-2rem),800px)]">
                {/* Title */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={localFormData.title}
                        onChange={(e) =>
                            setLocalFormData({
                                ...localFormData,
                                title: e.target.value,
                            })
                        }
                        className="w-full p-3 border rounded font-medium text-2xl"
                        placeholder="タイトルを入力してください"
                    />
                    <textarea
                        className="w-full p-3 border rounded mb-4 resize-none"
                        placeholder="説明を入力してください"
                        rows={1}
                        ref={textareaRef}
                        value={localFormData.description}
                        onChange={(e) =>
                            setLocalFormData({
                                ...localFormData,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <Questions
                    questionsData={localFormData.questions}
                    updateQuestionData={updateQuestionData}
                    deleteQuestion={deleteQuestion}
                />
                {/* 追加ボタン */}
                <AddQuestionBtn addQuestion={addQuestion} />
                <button
                    onClick={() => console.log(localFormData)}
                    className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200"
                >
                    console.log(localFormData)
                </button>

                {/* Submit Button（まだ無効） */}
                <button
                    onClick={saveFormData}
                    className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    フォームを保存
                </button>
            </div>
        </div>
    );
};

export default Create;
