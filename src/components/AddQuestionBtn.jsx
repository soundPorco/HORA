// src/components/AddQuestionBtn.jsx

const AddQuestionBtn = ({ addQuestion }) => {
    return (
        <button
            onClick={addQuestion}
            className="flex justify-center border-2 border-dashed border-gray-300 px-4 py-3 my-5 rounded-xl w-full text-sm font-semibold text-gray-400 hover:border-[#00468b] hover:text-[#00468b] transition"
        >
            設問を追加する
        </button>
    );
};

export default AddQuestionBtn;
