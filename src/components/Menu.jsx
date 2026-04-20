import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

// コンポーネント
import HelpModal from "./HelpModal";

// アイコン
import { IoMdEye } from "react-icons/io"; // プレビューアイコン
import { IoMdEyeOff } from "react-icons/io"; // プレビュー解除アイコン
import { MdLink } from "react-icons/md"; //リンクアイコン
import { MdLinkOff } from "react-icons/md"; //リンク解除アイコン
import { MdFormatListBulleted } from "react-icons/md"; //一覧アイコン
import { MdHelpOutline } from "react-icons/md"; //ヘルプアイコン
import { MdLogout } from "react-icons/md"; // ログアウトアイコン

const Menu = ({ setOpenLinkModal }) => {
    const navigate = useNavigate();
    const { formId } = useParams();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const [helpModalOpen, setHelpModalOpen] = useState(false); // ヘルプモーダルの状態を管理
    const [isPreviewing, setIsPreviewing] = useState(false); // プレビュー状態を管理

    const handleHelpClick = () => {
        setHelpModalOpen(true); // ヘルプモーダルを表示
    };

    const handleHelpClose = () => {
        setHelpModalOpen(false); // モーダルを非表示
    };

    const togglePreview = () => {
        if (isPreviewing) {
            // プレビューを終了
            navigate(-1); // 遷移元に戻る
        } else {
            // プレビューを開始
            navigate(`/preview/${formId}`, {
                state: { from: window.location.pathname },
            });
        }
        setIsPreviewing((prev) => !prev); // 状態をトグル
    };

    return (
        <>
            <div className="bg-[#00468b] text-white w-screen flex items-center justify-between h-20 px-8 relative">
                {/* アイコン */}
                <h1 className="md:text-3xl text-2xl font-bold">HORA</h1>

                {/* 右側メニュー */}
                <div className="flex items-center gap-4">
                    {/* プレビューボタン */}
                    {formId && (
                        <button
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                            onClick={togglePreview}
                        >
                            {isPreviewing ? <IoMdEyeOff /> : <IoMdEye />}
                            {/* <span className="absolute z-50 bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                プレビュー
                            </span> */}
                        </button>
                    )}
                    {/* リンクボタン */}
                    {formId && (
                        <button
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                            onClick={() => {
                                setOpenLinkModal(true);
                                console.log("openLinkModal set to true");
                            }}
                        >
                            <MdLink />
                        </button>
                    )}

                    {/* アンケート一覧へ戻る */}
                    {formId && (
                        <button
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                            onClick={() => navigate("/create-list")}
                        >
                            <MdFormatListBulleted />
                        </button>
                    )}

                    {/* ログアウトボタン */}
                    <button
                        onClick={handleLogout}
                        className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                    >
                        <MdLogout />
                    </button>

                    {/* ヘルプボタン */}
                    <button
                        onClick={handleHelpClick}
                        className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                    >
                        <MdHelpOutline />
                    </button>
                </div>
            </div>

            {/* ヘルプモーダル */}
            <HelpModal isOpen={helpModalOpen} onClose={handleHelpClose} />
        </>
    );
};

export default Menu;
