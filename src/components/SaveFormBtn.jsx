const SaveFormBtn = ({ saveFormData }) => {
    return (
        <div className="flex justify-end">
            <button
                onClick={() => saveFormData()}
                className="px-6 py-2 my-5 rounded-xl bg-[#00468b] text-white font-semibold hover:bg-[#003570] active:scale-[0.98] transition shadow-sm"
            >
                保存
            </button>
        </div>
    );
};

export default SaveFormBtn;
