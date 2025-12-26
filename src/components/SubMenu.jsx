import { useLocation } from "react-router-dom";

const SubMenu = ({ formId, navigate }) => {
    const location = useLocation();

    const isEditPage = location.pathname === `/edit/${formId}`;
    const isResultPage = location.pathname === `/result/${formId}`;

    return (
        <div className="w-screen flex items-center justify-between h-12 border-b px-8 border-gray-300 bg-gray-500">
            <div className="flex items-center text-white divide-x divide-white">
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
            <div></div>
        </div>
    );
};
export default SubMenu;
