import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
// import { use, useEffect } from "react";

// アイコン
import { MdContentCopy } from "react-icons/md";
import { MdCheck } from "react-icons/md";

// コンポーネント
import PublishToggle from "./PublishToggle";

const PublishModal = ({
    openModal,
    setOpenModal,
    toggleCopy,
    setToggleCopy,
    formId,
    published,
    url,
}) => {
    if (!openModal) return null;
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
        setOpenModal(false);
    };
    const togglePublish = async () => {
        const docRef = doc(db, "forms", formId);

        await updateDoc(docRef, {
            published: !published,
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
                {/* トグル */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="font-medium">
                        {published ? "公開中" : "非公開"}
                    </span>
                    <PublishToggle
                        published={published}
                        onToggle={togglePublish}
                    />
                </div>
                {/* アンケートを公開する場合 */}
                {published && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-center">
                            アンケート公開URL
                        </h2>
                        <div className="flex justify-center my-4">
                            <QRCodeCanvas
                                value={url} // ← QR化したい文字列（URL）
                                size={200} // サイズ(px)
                                level="M" // 誤り訂正レベル（L/M/Q/H）
                            />
                        </div>

                        <div
                            className="bg-gray-100 p-3 rounded break-all flex
                    items-center justify-between gap-2 max-w-[80%] mx-auto"
                        >
                            {/* URL */}
                            <div className="truncate max-w-[90%]">{url}</div>
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
                )}
            </div>
        </div>
    );
};

export default PublishModal;
