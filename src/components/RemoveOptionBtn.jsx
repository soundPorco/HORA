const RemoveOptionBtn = ({ updateQuestionData, data, index }) => {
    // 選択肢削除
    const removeOption = () => {
        updateQuestionData(data.id, {
            ...data,
            options: data.options.filter((_, i) => i !== index),
        });
    };

    return (
        <button
            onClick={removeOption}
            className="text-2xl text-gray-400 hover:text-gray-600 duration-200"
        >
            ×
        </button>
    );
};

export default RemoveOptionBtn;
