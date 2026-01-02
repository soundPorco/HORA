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

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(
                currentUser ? "ログイン: " + currentUser.uid : "未ログイン"
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
            {!user ? (
                <div className="text-center space-y-4">
                    {/* フォントはOswald */}
                    <h2 className="text-9xl font-bold font-Oswald">HORA</h2>
                    <div className="flex flex-col gap-3 w-56 mx-auto mt-8">
                        <button
                            className="text-black bg-[silver] font-bold rounded-full px-4 py-2 hover:bg-black hover:text-white transition duration-300"
                            onClick={handleGuestLogin}
                        >
                            ゲストログイン
                        </button>

                        <button
                            className="text-black bg-[silver] font-bold rounded-full px-4 py-2 hover:bg-black hover:text-white transition duration-300"
                            onClick={handleGoogleLogin}
                        >
                            Googleログイン
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">ログイン中</h2>
                    <p>UID: {user.uid}</p>
                    <button
                        className="p-2 bg-gray-800 text-white rounded"
                        onClick={handleLogout}
                    >
                        ログアウト
                    </button>
                    <button
                        onClick={() => navigate("/create-list")}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        フォーム作成
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
