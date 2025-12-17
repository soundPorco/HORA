// src/pages/Create.jsx
import { useState, useRef, useEffect } from "react";
import { auth, signOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化をインポート

// 画面遷移するためのフック
import { useNavigate } from "react-router-dom";
// URLパラメータを取得するためのフック
import { useParams } from "react-router-dom";
import autosize from "autosize";

// コンポーネント
import Questions from "../components/Questions";
import AddQuestionBtn from "../components/AddQuestionBtn";

const Create = () => {
    // 画面遷移用のフック
    const navigate = useNavigate();

    // formId が undefined → 新規作成
    // path="/edit/:formId"とpassを設定している（main.jsx）
    // useParamsを使ってURL の :〇〇 部分をオブジェクトとして取得する Hook
    const { formId } = useParams();
    // フォームのタイトルと説明
    const [formData, setFormData] = useState({
        userId: null,
        title: "",
        description: "",
        questions: [],
        // createdAt: null,
        updatedAt: null,
    });
    // ユーザーIDを取得してformDataにセット
    useEffect(() => {
        if (formId) {
            // 編集モードの場合は既存データを取得してセットする処理を追加予定
            // fetchとは読み込むという意味
            const fetchForm = async () => {
                const docRef = doc(db, "forms", formId);
                const snap = await getDoc(docRef);

                if (snap.exists()) {
                    setFormData({
                        id: snap.id,
                        ...snap.data(),
                    });
                } else {
                    alert("フォームが見つかりません");
                    navigate("/create-list");
                }
            };
            fetchForm();
        } else {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData((prev) => ({
                        ...prev,
                        userId: user.uid,
                    }));
                }
            });
            return () => unsubscribe(); // クリーンアップ
        }
    }, [formId, navigate]);

    // フォームデータをFirestoreに保存する関数
    const saveFormData = async () => {
        try {
            if (formId) {
                // 編集（更新）
                const docRef = doc(db, "forms", formId);
                await updateDoc(docRef, {
                    ...formData,
                    updatedAt: serverTimestamp(),
                });
                alert("フォームを更新しました");
            } else {
                const docRef = await addDoc(collection(db, "forms"), {
                    ...formData,
                    // createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }); // "forms" はコレクション名
                console.log("フォームが保存されました。ID: ", docRef.id);
                alert("フォームが保存されました！");
            }
            navigate("/create-list");
        } catch (e) {
            console.error("エラーが発生しました: ", e);
            alert("フォームの保存に失敗しました。");
        }
    };

    // 設問を更新する関数（後で Question → Questions → Create の順で渡す）
    const updateQuestionData = (id, newData) => {
        setFormData((prev) => ({
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
        setFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    // 設問削除
    const deleteQuestion = (id) => {
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };
    // 自動でテキストエリアの高さを調整するための設定
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* menu */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">アンケート作成</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    ログアウト
                </button>
            </div>

            {/* Form */}
            <div className="bg-slate-200 shadow-md rounded-lg p-6 mx-auto w-[min(calc(100%-2rem),800px)]">
                {/* Title */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-3 border rounded font-medium text-2xl"
                        placeholder="タイトルを入力してください"
                    />
                    <textarea
                        className="w-full p-3 border rounded mb-4 resize-none"
                        placeholder="説明を入力してください"
                        rows={1}
                        ref={textareaRef}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <Questions
                    questionsData={formData.questions}
                    updateQuestionData={updateQuestionData}
                    deleteQuestion={deleteQuestion}
                />
                {/* 追加ボタン */}
                <AddQuestionBtn addQuestion={addQuestion} />
                <button
                    onClick={() => console.log(formData)}
                    className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200"
                >
                    console.log(formData)
                </button>

                {/* Submit Button（まだ無効） */}
                <button
                    onClick={saveFormData}
                    className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    フォームを保存
                </button>
                <button
                    onClick={() => navigate("/create-list")}
                    className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    CreateList
                </button>
            </div>
        </div>
    );
};

export default Create;
