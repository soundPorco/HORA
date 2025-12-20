import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// コンポーネント
import AnswerView from "../components/AnswerView";
const Preview = () => {
    const { formId } = useParams();

    const [form, setForm] = useState(null);

    useEffect(() => {
        const fetchForm = async () => {
            // refとは参照の意味
            const docRef = doc(db, "forms", formId);
            // ↓↓↓Firestoreからデータが返ってくるまで 待ってから 次へ進む
            const snap = await getDoc(docRef);
            // snap は略語で、正式にはDocumentSnapshot（ドキュメントの写し）を指します。

            if (snap.exists()) {
                setForm(snap.data());
                console.log("フォームデータ:", snap.data());
            }
        };

        fetchForm();
    }, [formId]);
    // Firestore からデータを取得するまでローディング表示
    if (!form) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">読み込み中...</h1>
            </div>
        );
    }

    return (
        <AnswerView
            form={form}
            updateAnswer={""}
            handleSubmit={""}
            Preview={true}
        />
    );
};

export default Preview;
