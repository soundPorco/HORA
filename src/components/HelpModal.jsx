import React from "react";

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
                <button
                    className="absolute top-2 right-4 text-xl text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">ヘルプ</h2>
                <p className="text-gray-700">
                    ここにヘルプの内容を記載してください。
                </p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        次へ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
