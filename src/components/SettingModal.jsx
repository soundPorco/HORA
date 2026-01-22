import PublishToggle from "./PublishToggle";
// import { doc, updateDoc } from "firebase/firestore";

const SettingModal = ({
    openSettingModal,
    setOpenSettingModal,
    published,
    // setFormData,
    togglePublish,
    toggleShuffle,
    shuffleQuestions,
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
                    <div className="flex justify-between items-center mt-4">
                        <p>公開</p>
                        <button
                            onClick={togglePublish}
                            className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${published ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${published ? "translate-x-5" : ""}`}
                            />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <p>選択肢のシャッフル</p>
                            <p className="text-sm text-gray-500">
                                ※設問内の選択肢の並び順をランダムに表示します。
                            </p>
                        </div>
                        <button
                            onClick={toggleShuffle}
                            className={`w-12 h-7 rounded-full flex items-center px-1 transition
                            ${shuffleQuestions ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition
                                ${shuffleQuestions ? "translate-x-5" : ""}`}
                            />
                        </button>
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
            </div>
        </div>
    );
};
export default SettingModal;
