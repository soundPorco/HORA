import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

// アイコン
import { MdOutlineRemoveRedEye } from "react-icons/md"; // プレビューアイコン
import { MdLink } from "react-icons/md"; //リンクアイコン
import { MdLinkOff } from "react-icons/md"; //リンク解除アイコン
import { MdFormatListBulleted } from "react-icons/md"; //一覧アイコン
import { MdLogout } from "react-icons/md"; // ログアウトアイコン

const Menu = ({ setOpenModal }) => {
    const navigate = useNavigate();
    const { formId } = useParams();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
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
                            onClick={() => navigate(`/preview/${formId}`)}
                        >
                            <MdOutlineRemoveRedEye />
                            {/* <span className="absolute z-50 bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                プレビュー
                            </span> */}
                        </button>
                    )}
                    {/* リンクボタン */}
                    <button
                        className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                        onClick={() => {
                            setOpenModal(true);
                            console.log("openModal set to true");
                        }}
                    >
                        <MdLink />
                    </button>

                    {/* アンケート一覧へ戻る */}
                    <button
                        className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                        onClick={() => navigate("/create-list")}
                    >
                        <MdFormatListBulleted />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="relative text-2xl rounded-full p-2 hover:bg-gray-400 duration-200 group"
                    >
                        <MdLogout />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Menu;
