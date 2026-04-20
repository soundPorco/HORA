// src/App.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    auth,
    provider,
    signInAnonymously,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "./firebase";

import HelpModal from "./components/HelpModal";

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 初回起動チェックをuseStateの初期値で処理
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(() => {
        const isFirstSession = sessionStorage.getItem("isFirstSession");
        if (!isFirstSession) {
            sessionStorage.setItem("isFirstSession", "true"); // フラグを保存
            return true; // 初回起動時にモーダルを表示
        }
        return false;
    });

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(
                currentUser ? "ログイン: " + currentUser.uid : "未ログイン",
            );
        });
    }, []);

    const handleGuestLogin = () => {
        signInAnonymously(auth)
            .then(() => {
                console.log("匿名ログイン成功");
                navigate("/create-list");
            })
            .catch((err) => console.error("失敗:", err));
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(() => {
                console.log("Googleログイン成功");
                navigate("/create-list");
            })
            .catch((err) => console.error("失敗:", err));
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => console.log("ログアウト成功"))
            .catch((err) => console.error("失敗:", err));
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#00468B] text-white">
            {/* ヘルプモーダル */}
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />

            {!user ? (
                <div className="text-center space-y-8">
                    <h2 className="text-9xl font-bold font-Oswald">HORA</h2>
                    <div className="flex flex-col gap-3 w-56 mx-auto">
                        <button
                            className="bg-white text-[#00468B] font-semibold rounded-full px-4 py-2.5 hover:bg-white/80 transition duration-300"
                            onClick={handleGuestLogin}
                        >
                            ゲストログイン
                        </button>

                        <button
                            className="bg-white text-[#00468B] font-semibold rounded-full px-4 py-2.5 hover:bg-white/80 transition duration-300"
                            onClick={handleGoogleLogin}
                        >
                            Googleログイン
                        </button>

                        <div className="border-t border-white/20 my-1" />

                        <button
                            className="border border-white/40 text-white/70 font-semibold rounded-full px-4 py-2.5 hover:border-white hover:text-white transition duration-300"
                            onClick={() => navigate("/demo")}
                        >
                            デモを見る
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-8">
                    <h2 className="text-9xl font-bold font-Oswald">HORA</h2>
                    <div className="space-y-2">
                        <p className="text-white/60 text-sm">ログイン中</p>
                        <p className="text-white/40 text-xs font-mono">
                            {user.uid}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-56 mx-auto">
                        <button
                            onClick={() => navigate("/create-list")}
                            className="bg-white text-[#00468B] font-bold rounded-full px-4 py-2 hover:bg-white/80 transition duration-300"
                        >
                            フォーム一覧へ
                        </button>
                        <button
                            className="border border-white/40 text-white/70 font-bold rounded-full px-4 py-2 hover:border-white hover:text-white transition duration-300"
                            onClick={handleLogout}
                        >
                            ログアウト
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
