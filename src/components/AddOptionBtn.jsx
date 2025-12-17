const AddOptionBtn = ({ updateQuestionData, data }) => {
    // 選択肢追加
    const addOption = () => {
        updateQuestionData(data.id, {
            ...data,
            options: [...data.options, ""],
        });
    };

    return (
        <button
            onClick={addOption}
            className="mt-4 w-[max(calc(30%),180px)] py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 duration-200"
        >
            ＋ 選択肢を追加
        </button>
    );
};

export default AddOptionBtn;
