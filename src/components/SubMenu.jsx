import { useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// コンポーネント
import PublishToggle from "./PublishToggle";

const SubMenu = ({ formId, navigate, published, setFormData }) => {
    const location = useLocation();

    const isEditPage = location.pathname === `/edit/${formId}`;
    const isResultPage = location.pathname === `/result/${formId}`;

    const togglePublish = async () => {
        const newValue = !published;
        setFormData((prev) => ({
            ...prev,
            published: newValue,
        }));
        const docRef = doc(db, "forms", formId);

        await updateDoc(docRef, {
            published: newValue,
        });
    };

    return (
        <div className="w-screen flex items-center justify-between h-12 border-b px-8 border-gray-300 bg-gray-500">
            <div className="flex items-center text-white divide-x divide-gray-300">
                <button
                    className={`pe-6 ${
                        isEditPage
                            ? "cursor-default"
                            : "hover:underline duration-200 text-gray-300"
                    }`}
                    disabled={isEditPage}
                    onClick={() => navigate(`/edit/${formId}`)}
                >
                    編集
                </button>
                <button
                    className={`ps-6 ${
                        isResultPage
                            ? "cursor-default"
                            : "hover:text-white duration-200 text-gray-300"
                    }`}
                    disabled={isResultPage}
                    onClick={() => navigate(`/result/${formId}`)}
                >
                    集計結果
                </button>
            </div>

            {/* 公開ボタン */}
            <div className="flex items-center justify-center gap-4 text-white">
                <span className="font-medium">
                    {published ? "公開中" : "非公開"}
                </span>
                <PublishToggle published={published} onToggle={togglePublish} />
            </div>
        </div>
    );
};
export default SubMenu;
