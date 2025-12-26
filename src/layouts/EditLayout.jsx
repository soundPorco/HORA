import { Outlet, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

// コンポーネント
import PublishModal from "../components/PublishModal";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";

const EditLayout = () => {
    const { formId } = useParams();
    const navigate = useNavigate();

    // 公開モーダルの状態管理
    const [openModal, setOpenModal] = useState(false);
    const [toggleCopy, setToggleCopy] = useState(false);

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
        <div className="min-h-screen bg-gray-100">
            {/* 共通UI */}
            {/* MenuとSubMenuの配置 */}
            <div className="fixed top-0 z-40">
                <Menu setOpenModal={setOpenModal} />
                <SubMenu
                    formId={formId}
                    navigate={navigate}
                    published={!!formData?.published}
                    setFormData={setFormData}
                />
            </div>
            {/* Menu(20) + SubMenu(12) + 余白(8) = 40 */}
            <div className="h-40"></div>

            {/* 子ページの表示場所 */}
            <Outlet context={{ formData, openModal, setOpenModal }} />

            {/* 公開モーダル */}
            {openModal && (
                <PublishModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    toggleCopy={toggleCopy}
                    setToggleCopy={setToggleCopy}
                    url={`${window.location.origin}/answer/${formId}`}
                />
            )}
        </div>
    );
};

export default EditLayout;
