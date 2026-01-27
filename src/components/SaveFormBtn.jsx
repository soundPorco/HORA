const SaveFormBtn = ({ saveFormData }) => {
    return (
        <div className="flex justify-end">
            <button
                onClick={() => saveFormData()}
                className="w-[80px] border px-4 py-2 my-5 rounded-lg text-center bg-gray-400 text-white hover:bg-gray-500 hover:border-blue-500 duration-200"
            >
                保存
            </button>
        </div>
    );
};

export default SaveFormBtn;
