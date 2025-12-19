// アイコン
import { MdContentCopy } from "react-icons/md";
import { MdCheck } from "react-icons/md";

const PublishModal = ({ isOpen, toggleCopy, setToggleCopy, onClose, url }) => {
    if (!isOpen) return null; // ← 開いてない時は何も描画しない

    const handleCopy = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                // 確認用。実際はトースト表示などがおすすめ
                // alert("コピーしました！");
                setToggleCopy(true);
                setTimeout(() => setToggleCopy(false), 5000); // 3秒後にfalse
            })
            .catch((err) => {
                console.error("コピーに失敗しました: ", err);
            })
            .catch((err) => {
                console.error("コピーに失敗しました: ", err);
            });
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
                <h2 className="text-xl font-bold mb-4">アンケート公開URL</h2>

                <p className="text-sm text-gray-600 mb-2">
                    以下のURLを共有してください
                </p>

                <div
                    className="bg-gray-100 p-3 rounded break-all flex
                    items-center justify-between gap-2"
                >
                    <div>{url}</div>
                    {/* コピー用ボタン */}
                    {toggleCopy ? (
                        <MdCheck className="text-xl" />
                    ) : (
                        <MdContentCopy
                            onClick={handleCopy}
                            className="text-xl"
                        />
                    )}
                </div>

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
    );
};

export default PublishModal;
