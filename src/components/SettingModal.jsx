import PublishToggle from "./PublishToggle";
// import { doc, updateDoc } from "firebase/firestore";

const SettingModal = ({
    openSettingModal,
    setOpenSettingModal,
    // 公開状態の管理
    published,
    togglePublish,
    // シャッフル状態の管理
    toggleShuffle,
    shuffleQuestions,
    // 一人一回答の制限状態の管理
    restrictToOneResponse,
    toggleRestrictToOneResponse,
}) => {
    if (!openSettingModal) return null;

    const onClose = () => {
        setOpenSettingModal(false);
    };

    // const onToggle = async () => {
    //     const newValue = !published;
    //     setFormData((prev) => ({
    //         ...prev,
    //         published: newValue,
    //     }));
    //     console.log("新しい公開状態:", newValue);

    //     // Firestore に変更を保存
    //     try {
    //         const ref = doc(db, "forms", formData.id);
    //         await updateDoc(ref, { published: newValue });
    //         console.log(
    //             "新しい公開状態が Firestore に保存されました:",
    //             newValue
    //         );
    //     } catch (error) {
    //         console.error("公開状態の更新中にエラーが発生しました:", error);
    //     }
    // };

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
                                onClick={togglePublish}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${published ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${published ? "translate-x-5" : ""}`}
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
                                onClick={toggleShuffle}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${shuffleQuestions ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${shuffleQuestions ? "translate-x-5" : ""}`}
                                />
                            </button>
                        </div>

                        {/* 回答を一回に制限するトグル */}
                        <div className="flex justify-between items-center">
                            <p>回答を一回に制限する</p>
                            <button
                                onClick={toggleRestrictToOneResponse}
                                className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${restrictToOneResponse ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${restrictToOneResponse ? "translate-x-5" : ""}`}
                                />
                            </button>
                        </div>
                        {/* 閉じるボタン */}
                        {/* <div className="flex justify-center mt-6 gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                閉じる
                            </button>
                        </div> */}
                        <div className="flex justify-center mt-6 gap-2">
                            {/* 保存ボタン */}
                            <button
                                onClick={() => {
                                    // 保存処理を実行
                                    console.log("設定を保存しました");
                                    onClose();
                                }}
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
