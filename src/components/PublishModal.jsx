const PublishModal = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null; // ← 開いてない時は何も描画しない

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景（オーバーレイ） */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 z-10">
                <h2 className="text-xl font-bold mb-4">アンケート公開URL</h2>

                <p className="text-sm text-gray-600 mb-2">
                    以下のURLを共有してください
                </p>

                <div className="bg-gray-100 p-3 rounded text-sm break-all">
                    {url}
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        閉じる
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(url);
                        }}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        コピー
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishModal;
