const ConfirmModal = ({ message, onConfirm, onCancel, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md relative">
                <button
                    className="absolute top-4 right-6 text-xl text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    ×
                </button>

                <div className="text-center mt-[40px] mb-6 px-10">
                    <p className="text-gray-700">{message}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        className="px-4 py-2 rounded w-full duration-150 bg-blue-500 text-white hover:bg-blue-600"
                        onClick={onConfirm}
                    >
                        保存して移動
                    </button>
                    <button
                        className="px-4 py-2 rounded w-full duration-150 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={onCancel}
                    >
                        保存せずに移動
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
