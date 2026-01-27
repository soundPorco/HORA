const SaveFormBtn = ({ saveFormData }) => {
    return (
        <button
            onClick={() => saveFormData()}
            className="mt-4 w-[80px] py-2 bg-gray-400 text-white rounded-full duration-200 hover:bg-green-500"
        >
            保存
        </button>
    );
};

export default SaveFormBtn;
