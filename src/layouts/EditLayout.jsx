import { Outlet, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import SubMenu from "../components/SubMenu";

const EditLayout = () => {
    const { formId } = useParams();
    const navigate = useNavigate();

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
                <Menu />
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
            <Outlet context={{ formData, setFormData }} />
        </div>
    );
};

export default EditLayout;
