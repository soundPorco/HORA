// src/pages/Create.jsx
import { useState, useRef, useEffect } from "react";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore の初期化をインポート
import { useOutletContext } from "react-router-dom";
import autosize from "autosize";
import { MdLockOutline } from "react-icons/md";

// コンポーネント
import Questions from "../components/Questions";
import AddQuestionBtn from "../components/AddQuestionBtn";
import SaveFormBtn from "../components/SaveFormBtn";

const Create = () => {
    const { formData, setFormData } = useOutletContext() || {};
    const formId = formData.id;

    // formId が undefined → 新規作成
    // フォームのタイトルと説明
    const [localFormData, setLocalFormData] = useState({
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
            setFormData(localFormData);
            alert("フォームを保存しました");
        } catch (error) {
            console.error("フォームの保存中にエラーが発生しました:", error);
        }
    };

    // 設問を更新する関数（後で Question → Questions → Create の順で渡す）
    const updateQuestionData = (id, newData) => {
        setLocalFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((question) =>
                question.id === id ? newData : question,
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
        <div className="bg-slate-200 shadow-md rounded-lg px-6 pt-6 pb-1 mx-auto w-[min(calc(100%-2rem),800px)]">
            {/* 編集ロックバナー：デモ優先、次に公開中 */}
            {(localFormData.isDemo || localFormData.published) && (
                <div className={`flex items-start gap-3 rounded-lg px-4 py-3 mb-5 ${
                    localFormData.isDemo
                        ? "bg-slate-100 border border-slate-300 text-slate-800"
                        : "bg-amber-50 border border-amber-200 text-amber-900"
                }`}>
                    <MdLockOutline className={`text-xl shrink-0 mt-0.5 ${localFormData.isDemo ? "text-slate-400" : "text-amber-500"}`} />
                    {localFormData.isDemo ? (
                        <div>
                            <p className="font-semibold text-sm">サンプルデータのため編集できません</p>
                            <p className="text-xs text-slate-500 mt-0.5">このアンケートはデモ用のサンプルデータです。編集するには、新しいアンケートを作成してください。</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-semibold text-sm">公開中のため編集できません</p>
                            <p className="text-xs text-amber-700 mt-0.5">設定の公開トグルをオフにすると、編集が可能になります。</p>
                        </div>
                    )}
                </div>
            )}

            {/* アンケート作成フォーム */}
            <div className="">
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
                        className="w-full p-3 border rounded font-semibold text-2xl"
                        placeholder="タイトルを入力してください"
                        readOnly={localFormData.published}
                    />
                    <textarea
                        className="w-full p-3 border rounded mb-4 font-medium resize-none"
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
                        readOnly={localFormData.published}
                    />
                </div>

                <Questions
                    questionsData={localFormData.questions}
                    updateQuestionData={updateQuestionData}
                    deleteQuestion={deleteQuestion}
                    published={localFormData.published}
                />
                {/* 設問追加ボタン */}
                {!localFormData.published && (
                    <AddQuestionBtn addQuestion={addQuestion} />
                )}

                {/* Submit Button */}
                {!localFormData.published && (
                    <SaveFormBtn
                        saveFormData={() => saveFormData(localFormData)}
                    />
                )}
            </div>
        </div>
    );
};

export default Create;
