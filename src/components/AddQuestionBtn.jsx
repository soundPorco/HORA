// src/components/AddQuestionBtn.jsx

import { MdOutlineArrowDropDownCircle } from "react-icons/md";

const AddQuestionBtn = ({ addQuestion }) => {
    return (
        <button
            onClick={addQuestion}
            className="flex justify-center border px-4 py-2 my-5 rounded-lg text-center bg-white w-full text-gray-400 hover:text-gray-500 hover:border-blue-500 duration-200"
        >
            設問を追加する
        </button>
    );
};

export default AddQuestionBtn;
