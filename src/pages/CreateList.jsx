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
import { MdEdit } from "react-icons/md";
import { MdOutlineDataset } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

// アンケート一覧ページコンポーネント
import Menu from "../components/Menu";
import ListMenuBtn from "../components/ListMenuBtn";

const CreateList = () => {
    const [forms, setForms] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    // const [open, setOpen] = useState(false);
    // ドロップダウンメニューの開閉状態

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

    // Firestore からユーザーのアンケート一覧を取得
    useEffect(() => {
        if (!userId) return; // userId が設定されるまで待機

        const fetchForms = async () => {
            const q = query(
                collection(db, "forms"),
                where("userId", "==", userId),
                orderBy("updatedAt", "desc") // updatedAt を基準に並び替え
            );

            const snapshot = await getDocs(q);
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setForms(list);
        };

        fetchForms();
    }, [userId]); // userId が変更されたときにクエリを再実行

    // アンケート削除関数
    const deleteForm = async (formId) => {
        const isOk = window.confirm("このアンケートを削除しますか？");
        if (!isOk) return;

        try {
            await deleteDoc(doc(db, "forms", formId));
            alert("削除しました");

            // 画面からも即座に消す（再取得しなくて済む）
            setForms((prev) => prev.filter((form) => form.id !== formId));
        } catch (error) {
            console.error("削除に失敗しました", error);
            alert("削除に失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Menu />
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    あなたのアンケート一覧
                </h1>

                {/* アンケート一覧 */}
                <div className="space-y-4">
                    {forms.map((form) => (
                        <div
                            key={form.id} //crypto.randomUUID()
                            className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            {/* 左側：タイトルと日付 */}
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {form.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    更新日：
                                    {form.updatedAt
                                        ?.toDate()
                                        .toLocaleDateString()}
                                </p>
                            </div>

                            {/* 右側：操作ボタン */}
                            <ListMenuBtn
                                onEdit={() => navigate(`/edit/${form.id}`)}
                                onResult={() => navigate(`/result/${form.id}`)}
                                onDelete={() => deleteForm(form.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* 新規作成 */}
                <button
                    onClick={() => navigate("/create")}
                    className="mt-8 w-full py-4 border-2 border-dashed rounded-lg
                       text-lg font-semibold text-gray-600
                       hover:bg-gray-100 transition"
                >
                    ＋ 新しいアンケートを作成
                </button>
            </div>
        </div>
    );
};

export default CreateList;
