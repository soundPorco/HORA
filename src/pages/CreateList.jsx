import { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// アイコン
import { MdEdit, MdBarChart, MdAdd, MdOutlineDataset } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

// コンポーネント
import Menu from "../components/Menu";

const CreateList = () => {
    const [forms, setForms] = useState([]); // アンケートフォームのリストを保存するstate
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                return navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (!userId) return;

        // ユーザーIDに紐づくフォームを取得する関数
        const fetchForms = async () => {
            const q = query(
                collection(db, "forms"),
                where("userId", "==", userId),
                orderBy("updatedAt", "desc"),
            );
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setForms(list);
        };

        // デモフォームを取得する関数
        const fetchDemoForms = async () => {
            const q = query(
                collection(db, "forms"),
                where("isDemo", "==", true),
            );
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setForms((prev) => [...prev, ...list]);
        };

        fetchForms();
        fetchDemoForms();
    }, [userId]);

    const deleteForm = async (formId) => {
        const isOk = window.confirm("このアンケートを削除しますか？");
        if (!isOk) return;

        try {
            await deleteDoc(doc(db, "forms", formId));
            setForms((prev) => prev.filter((form) => form.id !== formId));
        } catch (error) {
            console.error("削除に失敗しました", error);
            alert("削除に失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 pb-40">
            <div className="fixed top-0 z-40">
                <Menu />
            </div>
            <div className="h-32" />

            <div className="max-w-2xl mx-auto px-4">
                {/* ページヘッダー */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">
                        アンケート一覧
                    </h1>
                    <span className="text-sm text-gray-400">
                        {forms.length} 件
                    </span>
                </div>

                {/* アンケート一覧 */}
                {(() => {
                    const userForms = forms.filter((f) => !f.isDemo);
                    const demoForms = forms.filter((f) => f.isDemo);

                    const renderCard = (form, isDemo) => (
                        <div
                            key={form.id}
                            className={`rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow ${
                                isDemo
                                    ? "bg-amber-50 border border-amber-200"
                                    : "bg-white"
                            }`}
                        >
                            {/* 左側：ステータスドット＋テキスト */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                        form.published
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    }`}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {form.title || "無題のアンケート"}
                                        </h3>
                                        {isDemo && (
                                            <span className="shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-amber-200 text-amber-700">
                                                DEMO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {form.published ? "公開中" : "非公開"}
                                        {form.updatedAt && (
                                            <>
                                                {" · "}
                                                {form.updatedAt
                                                    .toDate()
                                                    .toLocaleDateString()}
                                                {" 更新"}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* 右側：アクションボタン */}
                            <div className="flex items-center gap-0.5 shrink-0 ml-4">
                                <button
                                    onClick={() => navigate(`/edit/${form.id}`)}
                                    title="編集"
                                    className="p-2 text-gray-400 hover:text-[#00468b] hover:bg-blue-50 rounded-lg transition text-lg"
                                >
                                    <MdEdit />
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(`/result/${form.id}`)
                                    }
                                    title="結果"
                                    className="p-2 text-gray-400 hover:text-[#00468b] hover:bg-blue-50 rounded-lg transition text-lg"
                                >
                                    <MdBarChart />
                                </button>
                                {form.id === "demo" && (
                                    <button
                                        onClick={() => deleteForm(form.id)}
                                        title="削除"
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition text-lg"
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                )}
                            </div>
                        </div>
                    );

                    return (
                        <>
                            <div className="space-y-2">
                                {userForms.length === 0 ? (
                                    <div className="bg-white rounded-xl py-16 flex flex-col items-center text-gray-300 shadow-sm">
                                        <MdOutlineDataset className="text-5xl mb-3" />
                                        <p className="text-sm">
                                            アンケートがまだありません
                                        </p>
                                    </div>
                                ) : (
                                    userForms.map((form) =>
                                        renderCard(form, false),
                                    )
                                )}
                            </div>

                            {demoForms.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs font-medium text-amber-600 mb-2 px-1">
                                        サンプルデータ（デモ用）
                                    </p>
                                    <div className="space-y-2">
                                        {demoForms.map((form) =>
                                            renderCard(form, true),
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}

                {/* 新規作成ボタン */}
                <button
                    onClick={() => navigate("/create-new")}
                    className="mt-4 w-full py-3.5 bg-[#00468b] text-white rounded-xl font-semibold
                               hover:bg-[#003570] active:scale-[0.98] transition
                               flex items-center justify-center gap-2 shadow-sm"
                >
                    <MdAdd className="text-xl" />
                    新しいアンケートを作成
                </button>
            </div>
        </div>
    );
};

export default CreateList;
