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
        <>
            <button
                onClick={addOption}
                className=" hover:bg-gray-100 duration-200 mt-2 p-2 text-sm rounded-md text-blue-500"
            >
                <span>選択肢を追加</span>
            </button>
        </>
    );
};

export default AddOptionBtn;
