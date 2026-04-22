const ConfirmModal = ({ message, onConfirm, onCancel, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景（オーバーレイ） */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-lg py-6 px-10 z-10">
                <p className="text-base mb-6 text-center">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        保存して続行
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        保存せずに続行
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 text-gray-500 rounded hover:bg-gray-100"
                        onClick={onClose}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
