// src/pages/CreateNew.jsx
import { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import autosize from "autosize";
import { onAuthStateChanged } from "firebase/auth"; // ログイン状態が変化したときに実行される監視関数

// components
import Questions from "../components/Questions";
import AddQuestionBtn from "../components/AddQuestionBtn";
import Menu from "../components/Menu";

const CreateNew = () => {
    // 🔹 新規作成用の初期データ
    const [NewFormData, setNewFormData] = useState({
        userId: null,
        published: false, // 公開状態
        shuffleQuestions: false, // 質問のシャッフル状態
        restrictToOneResponse: false, // 一人一回答の制限
        title: "",
        description: "",
        questions: [],
        // createdAt: null,
        updatedAt: null,
    });

    // textarea 自動リサイズ
    const textareaRef = useRef(null);
    useEffect(() => {
        if (textareaRef.current) autosize(textareaRef.current);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            //userには現在のユーザー情報が自動的に入る
            if (user) {
                setNewFormData((prev) => ({
                    ...prev,
                    userId: user.uid, // uidは固有名称
                }));
            } else {
                return alert("フォームの保存に失敗しました。");
            }
        });

        return () => unsubscribe(); // この部分はuseEffectのクリーンアップ関数として、コンポーネントが消える際に実行されるようにできている。
    }, []);

    // 設問を更新する関数（後で Question → Questions → Create の順で渡す）
    const updateQuestionData = (id, newData) => {
        setNewFormData((prev) => ({
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
        setNewFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    // 設問削除
    const deleteQuestion = (id) => {
        setNewFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    // フォームデータをFirestoreに保存する関数
    const saveFormData = async (NewFormData) => {
        try {
            const docRef = await addDoc(collection(db, "forms"), {
                ...NewFormData,
                createdAt: serverTimestamp(),
            });
            console.log("フォームが保存されました。ID: ", docRef.id);
            alert("フォームが保存されました！");
        } catch (error) {
            console.error("フォームの保存中にエラーが発生しました:", error);
            alert("フォームの保存に失敗しました。");
        }
    };

    return (
        <>
            {/* 新規作成は Menu のみ */}
            <div className="fixed top-0 z-40">
                <Menu />
            </div>
            <div className="h-24"></div>

            {/* アンケート作成フォーム */}
            <div className="bg-slate-200 shadow-md rounded-lg p-6 mx-auto w-[min(calc(100%-2rem),800px)]">
                {/* Title */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={NewFormData.title}
                        onChange={(e) =>
                            setNewFormData({
                                ...NewFormData,
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
                        value={NewFormData.description}
                        onChange={(e) =>
                            setNewFormData({
                                ...NewFormData,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <Questions
                    questionsData={NewFormData.questions}
                    updateQuestionData={updateQuestionData}
                    deleteQuestion={deleteQuestion}
                />
                {/* 設問追加ボタン */}
                <AddQuestionBtn addQuestion={addQuestion} />

                {/* Submit Button（まだ無効） */}
                <button
                    onClick={() => saveFormData(NewFormData)}
                    className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    フォームを保存
                </button>
            </div>
        </>
    );
};

export default CreateNew;
