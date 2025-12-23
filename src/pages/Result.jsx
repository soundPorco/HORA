import { useParams } from "react-router-dom";
import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const Result = () => {
    // ルーティングパラメータ(URL)から formId を取得
    const { formId } = useParams();

    const [answers, setAnswers] = useState([]);
    const [summary, setSummary] = useState({}); // ← 集計結果
    const [questions, setQuestions] = useState([]);

    // ======================
    // 設問ごとの集計処理
    // ======================
    const aggregateAnswers = (answersList) => {
        const result = {};

        answersList.forEach((answerDoc) => {
            const answers = answerDoc.answers;

            if (!answers) return; // answersが存在しない場合はスキップ

            Object.entries(answers).forEach(([questionId, value]) => {
                if (!result[questionId]) {
                    result[questionId] = {};
                }

                // 複数選択（checkbox）
                // Array.isArray() でvalueが配列かどうかを判定
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        if (v) {
                            // value が null/undefined でない場合のみ処理
                            result[questionId][v] =
                                (result[questionId][v] || 0) + 1;
                        }
                    });
                } else if (value) {
                    // 単一回答
                    result[questionId][value] =
                        (result[questionId][value] || 0) + 1;
                }
            });
        });

        setSummary(result);
    };

    useEffect(() => {
        // 回答データの取得
        const fetchAnswers = async () => {
            const answersQuery = query(
                collection(db, "answers"),
                where("formId", "==", formId)
            );

            // snapshot = 特定の状態をコピーする変数の総称
            const answerSnapshot = await getDocs(answersQuery);

            console.log("answerSnapshot:", answerSnapshot); // デバッグ用ログ

            // 以下でデータを扱いやすいように変換
            const answerList = answerSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("取得した回答データ:", answerList); // デバッグ用ログ

            setAnswers(answerList);
            // aggregate = 集計
            aggregateAnswers(answerList); // ← 集計処理
        };

        // 設問データの取得
        const fetchQuestions = async () => {
            const formRef = collection(db, "forms");
            const formSnapshot = await getDocs(
                query(formRef, where("id", "==", formId))
            );

            if (!formSnapshot.empty) {
                const formData = formSnapshot.docs[0].data();
                setQuestions(formData.questions || []);
            }
        };

        fetchAnswers();
        fetchQuestions();
    }, [formId]);

    // 設問IDに対応する設問タイトルを取得する関数
    const getQuestionTitle = (questionId) => {
        const question = questions.find((q) => q.id === questionId);
        return question ? question.questionTitle : "不明な設問";
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">回答結果</h1>
            <h2 className="text-xl font-bold mb-4">
                回答総数：{answers.length}
            </h2>

            {answers.length === 0 || Object.keys(summary).length === 0 ? (
                <div>まだ回答がありません</div>
            ) : (
                Object.entries(summary).map(([questionId, counts]) => (
                    <div key={questionId} className="border rounded p-4 mb-4">
                        <h2 className="font-semibold mb-2">
                            {getQuestionTitle(questionId)}
                        </h2>

                        {Object.entries(counts).map(([answer, count]) => (
                            <div key={answer} className="flex justify-between">
                                <span>{answer}</span>
                                <span>{count} 件</span>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Result;
