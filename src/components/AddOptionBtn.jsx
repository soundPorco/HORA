import { MdAddCircleOutline } from "react-icons/md";

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
            className="mt-4 bg-gray-400 text-white rounded-full hover:bg-gray-500 duration-200"
        >
            <MdAddCircleOutline className="text-2xl" />
        </button>
    );
};

export default AddOptionBtn;
