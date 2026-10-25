const SaveFormBtn = ({ saveFormData, hasUnsavedChanges }) => {
    return (
        <div className="flex justify-end">
            <button
                onClick={() => saveFormData()}
                disabled={!hasUnsavedChanges} // 未保存の変更がない場合はボタンを無効化
                className={`px-6 py-2 my-5 rounded-xl  text-white font-semibold active:scale-[0.98] transition shadow-sm
                    ${hasUnsavedChanges ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}

                // 未保存の変更がない場合はボタンを無効化
            >
                保存
            </button>
        </div>
    );
};

export default SaveFormBtn;
