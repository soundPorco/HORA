import { useParams } from "react-router-dom";
import {
    // doc,
    getDocs,
    where,
    collection,
    query,
    // addDoc,
    // collection,
    // serverTimestamp,
} from "firebase/firestore";
import {
    db,
    // auth
} from "../firebase";
import { useEffect, useState } from "react";

const Result = () => {
    const { formId } = useParams();

    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            const q = query(
                collection(db, "answers"),
                where("formId", "==", formId)
            );

            const snapshot = await getDocs(q);

            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnswers(list); // 複数回答を想定
            console.log(list);
            // refとは参照の意味
            // const docRef = doc(db, "answers", formId);
            // ↓↓↓Firestoreからデータが返ってくるまで 待ってから 次へ進む
            // const snap = await getDoc(docRef);
            // snap は略語で、正式にはDocumentSnapshot（ドキュメントの写し）を指します。

            // if (snap.exists()) {
            //     setAnswer(snap.data());
            //     console.log("フォームデータ:", snap.data());
            // }
        };

        fetchAnswers();
    }, [formId]);
    return (
        <>
            {answers.length === 0 ? (
                <div>まだ回答がありません</div>
            ) : (
                answers.map((a, index) => (
                    <div key={a.id} className="border p-2 mb-2">
                        <p>回答 {index + 1}</p>
                        <pre>{JSON.stringify(a.answers, null, 2)}</pre>
                    </div>
                ))
            )}
        </>
    );
};

export default Result;
