// src/components/AddQuestionBtn.jsx

import { MdAddCircleOutline } from "react-icons/md";

const AddQuestionBtn = ({ addQuestion }) => {
    return (
        <button
            onClick={addQuestion}
            className="flex items-center justify-center mt-4 w-[150px] py-2 gap-1 bg-gray-400 text-white rounded-full duration-200 m-auto hover:bg-gray-500"
        >
            <MdAddCircleOutline /> 設問を追加
        </button>
    );
};

export default AddQuestionBtn;
