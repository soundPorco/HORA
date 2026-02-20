import { useLocation } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md"; // 下向き矢印アイコン

const SubMenu = ({ formId, navigate, published, setOpenSettingModal }) => {
    const location = useLocation();

    const isEditPage = location.pathname === `/edit/${formId}`;
    const isResultPage = location.pathname === `/result/${formId}`;

    return (
        <div className="w-screen flex items-center justify-between h-12 border-b px-8 border-gray-300 bg-gray-500">
            <div className="flex items-center text-white divide-x divide-gray-300">
                <button
                    className={`pe-6 ${
                        isEditPage
                            ? "cursor-default"
                            : "hover:text-white duration-200 text-gray-300"
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
                {/* <span>{published ? "公開中" : "非公開"}</span>
                <PublishToggle published={published} onToggle={togglePublish} /> */}

                <button
                    className="flex items-center group"
                    onClick={() => setOpenSettingModal(true)}
                >
                    <span className="text-gray-300 group-hover:text-white duration-200 flex items-center gap-1">
                        {published ? (
                            <p className="text-[#b60000] group-hover:text-[#ff0000] duration-200 animate-blink">
                                ●
                            </p>
                        ) : (
                            ""
                        )}
                        設定
                    </span>
                    <MdArrowDropDown className="text-3xl text-gray-300 group-hover:text-white duration-200" />
                </button>
            </div>
        </div>
    );
};
export default SubMenu;
