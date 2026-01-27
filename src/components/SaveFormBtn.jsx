const SaveFormBtn = ({ saveFormData }) => {
    return (
        <button
            onClick={() => saveFormData()}
            className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
            フォームを保存
        </button>
    );
};

export default SaveFormBtn;
