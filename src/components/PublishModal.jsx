import { QRCodeCanvas } from "qrcode.react";
// import { use, useEffect } from "react";

// アイコン
import { MdContentCopy } from "react-icons/md";
import { MdCheck } from "react-icons/md";

const PublishModal = ({
    openLinkModal,
    setOpenLinkModal,
    toggleCopy,
    setToggleCopy,
    url,
}) => {
    if (!openLinkModal) return null;
    // ← 開いてない時は何も描画しない

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
    const onClose = () => {
        setOpenLinkModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景（オーバーレイ） */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 z-10">
                <h2 className="text-base font-bold text-gray-900 text-center mb-5">
                    アンケート公開URL
                </h2>

                {/* QRコード */}
                <div className="flex justify-center mb-5">
                    <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <QRCodeCanvas
                            value={url}
                            size={160}
                            level="M"
                        />
                    </div>
                </div>

                {/* URLコピー欄 */}
                <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2">
                    <span className="flex-1 text-xs text-gray-500 truncate">{url}</span>
                    <button
                        onClick={handleCopy}
                        className={`shrink-0 p-1.5 rounded-lg transition ${
                            toggleCopy
                                ? "text-green-500 bg-green-50"
                                : "text-gray-400 hover:text-[#00468b] hover:bg-blue-50"
                        }`}
                    >
                        {toggleCopy ? (
                            <MdCheck className="text-lg" />
                        ) : (
                            <MdContentCopy className="text-lg" />
                        )}
                    </button>
                </div>

                {/* 閉じるボタン */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default PublishModal;
