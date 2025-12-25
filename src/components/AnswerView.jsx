const AnswerView = ({ form, updateAnswer, handleSubmit, Preview }) => {
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
                                        onChange={(e) => {
                                            updateAnswer(
                                                question.id,
                                                opt,
                                                e.target.checked
                                            );
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

                {!Preview && (
                    <button
                        onClick={handleSubmit}
                        className={`w-full text-white py-3 rounded ${
                            form.published
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!form.published}
                    >
                        {form.published
                            ? "回答を送信"
                            : "アンケートは非公開です"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AnswerView;
