import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

// アイコン
import { MdOutlineRemoveRedEye } from "react-icons/md"; // プレビューアイコン
import { RiSendPlane2Line } from "react-icons/ri"; // 公開アイコン
import { MdFormatListBulleted } from "react-icons/md"; //一覧アイコン
import { MdLogout } from "react-icons/md"; // ログアウトアイコン

const Menu = () => {
    const navigate = useNavigate();
    const { formId } = useParams();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };
    const handlePublish = () => {
        const url = `${window.location.origin}/answer/${formId}`;
        alert(`このURLを共有してください\n\n${url}`);
    };

    return (
        <>
            <div className="fixed top-0 z-40">
                <div className="bg-white w-screen flex items-center justify-between md:h-20 h-20 border-b px-6 border-gray-300 relative">
                    {/* アイコン */}
                    <h1 className="md:text-3xl text-2xl font-bold">HORA</h1>

                    {/* 右側メニュー */}
                    <div className="flex items-center gap-4">
                        {/* プレビューボタン */}
                        <button className="relative text-2xl rounded-full p-2 hover:bg-gray-200 duration-200 group">
                            <MdOutlineRemoveRedEye />
                            {/* <span className="absolute z-50 bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                プレビュー
                            </span> */}
                        </button>

                        {/* 公開ボタン */}
                        <button
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-200 duration-200 group"
                            onClick={handlePublish}
                        >
                            <RiSendPlane2Line />
                        </button>
                        {/* アンケート一覧へ戻る */}
                        <button
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-200 duration-200 group"
                            onClick={() => navigate("/create-list")}
                        >
                            <MdFormatListBulleted />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="relative text-2xl rounded-full p-2 hover:bg-gray-200 duration-200 group"
                        >
                            <MdLogout />
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-24"></div>
        </>
    );
};

export default Menu;
