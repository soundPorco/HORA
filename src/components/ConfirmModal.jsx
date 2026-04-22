// import { doc, updateDoc } from "firebase/firestore";
// import { useState } from "react";

const ConfirmModal = ({
    // message, onConfirm, onCancel,
    onClose,
}) => {
    // ローカルで設定を管理するstate

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 背景（オーバーレイ） */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-lg py-6 px-10 z-10">
                {/* モーダル内容 */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-center">
                        アンケート詳細設定
                    </h2>
                </div>
            </div>
        </div>
    );
};
export default ConfirmModal;
