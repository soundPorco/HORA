import { Outlet, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

// コンポーネント
import PublishModal from "../components/PublishModal";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";
import SettingModal from "../components/SettingModal";

const EditLayout = () => {
    const { formId } = useParams();
    const navigate = useNavigate();

    // 公開モーダルの状態管理
    const [openLinkModal, setOpenLinkModal] = useState(false);
    const [toggleCopy, setToggleCopy] = useState(false);

    // 設定モーダルの状態管理
    const [openSettingModal, setOpenSettingModal] = useState(false);

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            const ref = doc(db, "forms", formId);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                alert("フォームが見つかりません");
                navigate("/create-list");
                return;
            }
            setFormData({ id: snap.id, ...snap.data() });
            setLoading(false);
        };

        fetchForm();
    }, [formId, navigate]);

    // 設定をまとめて保存する関数、SettingModalから呼び出される
    const saveSettings = async (newSettings) => {
        const docRef = doc(db, "forms", formId);

        // state更新
        setFormData((prev) => ({
            ...prev,
            ...newSettings,
        }));

        // Firestore更新（1回だけ）
        await updateDoc(docRef, newSettings);

        console.log("設定をまとめて保存しました", newSettings);
    };

    if (loading) return <div className="p-6">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* 共通UI */}
            {/* MenuとSubMenuの配置 */}
            <div className="fixed top-0 z-40">
                <Menu setOpenLinkModal={setOpenLinkModal} />
                <SubMenu
                    formId={formId}
                    navigate={navigate}
                    published={!!formData?.published}
                    setOpenSettingModal={setOpenSettingModal}
                />
            </div>
            {/* Menu(20) + SubMenu(12) + 余白(12) = 44 */}
            <div className="h-44"></div>

            {/* 子ページの表示場所 */}
            <Outlet context={{ formData, setFormData }} />

            {/* 公開モーダル */}
            {openLinkModal && (
                <PublishModal
                    openLinkModal={openLinkModal}
                    setOpenLinkModal={setOpenLinkModal}
                    toggleCopy={toggleCopy}
                    setToggleCopy={setToggleCopy}
                    url={`${window.location.origin}/HORA/#/answer/${formId}`}
                />
            )}

            {/* 設定モーダル */}
            {openSettingModal && (
                <SettingModal
                    // モーダルの開閉管理
                    setOpenSettingModal={setOpenSettingModal}
                    openSettingModal={openSettingModal}
                    // フォームデータの管理
                    setFormData={setFormData}
                    // 初期設定の値を渡す
                    initialSettings={{
                        published: !!formData.published,
                        shuffleQuestions: !!formData.shuffleQuestions,
                        restrictToOneResponse: !!formData.restrictToOneResponse,
                    }}
                    saveSettings={saveSettings}
                />
            )}
        </div>
    );
};

export default EditLayout;
