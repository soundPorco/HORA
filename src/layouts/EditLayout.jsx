import { Outlet, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
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
                    setFormData={setFormData}
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
                    setOpenSettingModal={setOpenSettingModal}
                    openSettingModal={openSettingModal}
                />
            )}
        </div>
    );
};

export default EditLayout;
