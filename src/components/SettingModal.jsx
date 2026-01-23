// import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const SettingModal = ({
    openSettingModal,
    setOpenSettingModal,
    initialSettings, // 親から渡される初期設定
    saveSettings, // 親へ設定をまとめて渡す関数
}) => {
    // ローカルで設定を管理するstate
    const [settings, setSettings] = useState(initialSettings);

    // モーダルが開いていない場合は何も表示しない
    if (!openSettingModal) return null;

    // ローカルのstateを切り替える関数
    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        console.log("値が変更されました:", key, !settings[key]);
    };

    // 設定保存用の関数
    const handleSave = () => {
        saveSettings(settings); // 親へまとめて渡す
        setOpenSettingModal(false); // モーダルを閉じる
    };

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
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-lg py-6 px-10 z-10">
                {/* モーダル内容 */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-center">
                        アンケート詳細設定
                    </h2>

                    {/* 詳細設定のflex */}
                    <div className="flex flex-col gap-4">
                        {/* 公開状態のトグル */}
                        <div className="flex justify-between items-center">
                            <p>公開</p>
                            <button
                                onClick={() => toggleSetting("published")}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${settings.published ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${settings.published ? "translate-x-5" : ""}`}
                                />
                            </button>
                        </div>

                        {/* 選択肢シャッフルのトグル */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p>選択肢のシャッフル</p>
                                <p className="text-sm text-gray-500">
                                    ※設問内の選択肢の並び順をランダムに表示します。
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    toggleSetting("shuffleQuestions")
                                }
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${settings.shuffleQuestions ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${settings.shuffleQuestions ? "translate-x-5" : ""}`}
                                />
                            </button>
                        </div>

                        {/* 回答を一回に制限するトグル */}
                        <div className="flex justify-between items-center">
                            <p>回答を一回に制限する</p>
                            <button
                                onClick={() =>
                                    toggleSetting("restrictToOneResponse")
                                }
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${settings.restrictToOneResponse ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${settings.restrictToOneResponse ? "translate-x-5" : ""}`}
                                />
                            </button>
                        </div>

                        {/* モーダルのフッター */}
                        <div className="flex justify-center mt-6 gap-2">
                            {/* 保存ボタン */}
                            <button
                                onClick={() => handleSave()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                保存
                            </button>

                            {/* キャンセルボタン */}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SettingModal;
