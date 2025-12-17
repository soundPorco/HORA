// src/components/AddQuestionBtn.jsx
const AddQuestionBtn = ({ addQuestion }) => {
    return (
        <button
            onClick={addQuestion}
            className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200"
        >
            ＋ 設問を追加
        </button>
    );
};

export default AddQuestionBtn;
