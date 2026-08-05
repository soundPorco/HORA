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
    const [isIntroModalOpen, setIsIntroModalOpen] = useState(() => {
        return sessionStorage.getItem("isIntroModalClosed") !== "true";
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

    const closeIntroModal = () => {
        sessionStorage.setItem("isIntroModalClosed", "true");
        setIsIntroModalOpen(false);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#00468B] text-white">
            {/* ヘルプモーダル */}
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />

            {!user && !isHelpModalOpen && isIntroModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl bg-white px-8 py-8 text-[#00468B] shadow-2xl">
                        <button
                            className="absolute right-4 top-4 text-2xl leading-none text-[#00468B]/60 transition hover:text-[#00468B]"
                            onClick={closeIntroModal}
                            aria-label="閉じる"
                        >
                            ×
                        </button>
                        <div className="space-y-4">
                            <p className="text-xs font-semibold text-center tracking-[0.3em] text-[#00468B]/50">
                                DEMO GUIDE
                            </p>

                            <h3 className="text-md font-semibold leading-7 text-[#00468B]/80">
                                まずはゲストログインで、操作感をご確認ください。デモやアプリの機能、概要を体験できます。
                            </h3>
                            <p className="text-xs text-red-500">
                                ※ゲストログインで作成したデータは保存されません。
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
