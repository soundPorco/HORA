import React, { useEffect, useState } from "react";

const AnswerView = ({
    form,
    updateAnswer,
    handleSubmit,
    Preview,
    voted,
    formData,
    localFormData,
}) => {
    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    const Unsaved = JSON.stringify(formData) !== JSON.stringify(localFormData);

    // 配列をシャッフルする関数（Fisher-Yatesアルゴリズム）
    const shuffle = (array) => {
        const arr = [...array]; // 元の配列を壊さない
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // () を追加
            [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
        }
        return arr;
    };

    useEffect(() => {
        if (!form?.questions) return;

        const shuffled = form.questions.map((question) => ({
            ...question,
            options: shuffle(question.options),
        }));

        setShuffledQuestions(shuffled);
    }, [form]);

    const renderOptions = (question) => (
        <div className="space-y-2 mt-3">
            {/* ラジオボタン */}
            {question.questionType === "ラジオボタン" && (
                <>
                    {question.options.map((opt, i) => (
                        <label
                            key={i}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-[#00468b] hover:bg-blue-50 cursor-pointer transition"
                        >
                            <input
                                type="radio"
                                name={question.id}
                                onChange={() => updateAnswer(question.id, opt)}
                                className="accent-[#00468b]"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                    {!question.required && (
                        <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-gray-200 hover:border-gray-400 cursor-pointer transition">
                            <input
                                type="radio"
                                name={question.id}
                                onChange={() => updateAnswer(question.id, "")}
                                className="accent-gray-400"
                            />
                            <span className="text-sm text-gray-400">
                                未回答
                            </span>
                        </label>
                    )}
                </>
            )}

            {/* チェックボックス */}
            {question.questionType === "チェックボックス" &&
                question.options.map((opt, i) => (
                    <label
                        key={i}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-[#00468b] hover:bg-blue-50 cursor-pointer transition"
                    >
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                updateAnswer(question.id, opt, e.target.checked)
                            }
                            className="accent-[#00468b]"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                ))}

            {/* プルダウン */}
            {question.questionType === "プルダウン" && (
                <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#00468b] transition"
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                >
                    <option value="">
                        {question.required ? "選択してください" : "未回答"}
                    </option>
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#00468b] transition resize-none"
                    rows={3}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                />
            )}
        </div>
    );

    const renderQuestions = (questions) => (
        <div className="space-y-4">
            {questions.map((question, index) => (
                <div key={question.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#00468b] uppercase tracking-wide">
                            Q{index + 1}
                        </span>
                        {question.required && (
                            <span className="text-xs font-semibold text-red-400">
                                必須
                            </span>
                        )}
                    </div>
                    <p className="font-semibold text-gray-800 pb-3 border-b border-gray-200">
                        {question.questionTitle}
                    </p>
                    {renderOptions(question)}
                </div>
            ))}
        </div>
    );

    const submitButton = (
        <button
            onClick={handleSubmit}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition active:scale-[0.98] ${
                form.isDemo || form.published
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#00468b] hover:bg-[#003570] shadow-sm"
            }`}
            disabled={form.isDemo || !form.published}
        >
            {form.isDemo
                ? "サンプルのため回答できません"
                : form.published
                  ? "回答を送信"
                  : "アンケートが非公開です"}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            {voted ? (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-10 text-center">
                    <p className="text-4xl mb-4">🎉</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        ご回答ありがとうございました！
                    </h2>
                    <p className="text-sm text-gray-500">
                        あなたの回答は正常に送信されました。
                    </p>
                </div>
            ) : // シャッフル設定の分岐
            form.shuffleQuestions ? (
                // シャッフル設定が有効な場合
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {form.title}{" "}
                            {Unsaved &&
                                "（未保存の変更はプレビューに反映されません）"}
                        </h1>
                        {form.description && (
                            <p className="mt-1 text-sm text-gray-500">
                                {form.description}
                            </p>
                        )}
                    </div>
                    {renderQuestions(shuffledQuestions)}
                    {!Preview && submitButton}
                </div>
            ) : (
                // シャッフル設定が無効な場合
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {form.title}{" "}
                            {Unsaved &&
                                "（未保存の変更はプレビューに反映されません）"}
                        </h1>
                        {form.description && (
                            <p className="mt-1 text-sm text-gray-500">
                                {form.description}
                            </p>
                        )}
                    </div>
                    {renderQuestions(form.questions)}
                    <div>
                        {/* デバッグ用：現在の設定を表示 */}
                        {/* <button onClick={() => console.log(form)}>debug</button> */}
                    </div>
                    {!Preview && submitButton}
                </div>
            )}
        </div>
    );
};

export default AnswerView;
