const SettingModal = ({ openSettingModal, setOpenSettingModal }) => {
    if (!openSettingModal) return null;

    const onClose = () => {
        setOpenSettingModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景（オーバーレイ） */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 z-10">
                {/* モーダル内容 */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-center">
                        アンケート公開URL
                    </h2>
                    {/* 閉じるボタン */}
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SettingModal;
