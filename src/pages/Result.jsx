import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";

// 「累積回答数 × 時間」の折れ線グラフを描画するためのライブラリ
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { orderBy } from "firebase/firestore";

// コンポーネント
import RenderResultByQuestionType from "../components/renderResultByQuestionType"; // 設問タイプごとに集計結果の表示方法を切り替えるコンポーネント

const Result = () => {
    const { formData } = useOutletContext();
    const formId = formData.id;

    const [responseList, setResponseList] = useState([]);
    const [resultSummary, setResultSummary] = useState({}); // ← 集計結果
    const questions = formData.questions || [];

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "answers"),
            where("formId", "==", formId),
            orderBy("votedAt", "asc"),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let count = 0;

            const cumulative = snapshot.docs.map((doc) => {
                count++;
                const data = doc.data();

                return {
                    time: data.votedAt?.toDate().toLocaleTimeString(),
                    count: count,
                };
            });

            setChartData(cumulative);
        });

        return () => unsubscribe();
    }, [formId]);

    //

    // ======================
    // 設問ごとの集計処理
    // ======================
    const aggregateResponses = (responseList) => {
        const result = {};

        // 全ての回答者のデータから各回答者を順番に処理
        responseList.forEach((responseItem) => {
            const questionAnswers = responseItem.answers;
            console.log(
                "単一回答者の各設問に対する回答データ",
                questionAnswers,
            ); // デバッグ用ログ

            if (!questionAnswers) return; // questionAnswersが存在しない場合はスキップ

            Object.entries(questionAnswers).forEach(
                ([questionId, answerValue]) => {
                    if (!result[questionId]) {
                        result[questionId] = {};
                    }

                    // 複数選択（checkbox）の際はanswerValueが配列になるため以下で対応
                    // Array.isArray() でanswerValueが配列かどうかを判定
                    if (Array.isArray(answerValue)) {
                        answerValue.forEach((value) => {
                            if (value) {
                                // answerValue が null/undefined でない場合のみ処理
                                result[questionId][value] =
                                    (result[questionId][value] || 0) + 1;
                            }
                        });
                    } else if (answerValue) {
                        // 単一回答
                        result[questionId][answerValue] =
                            (result[questionId][answerValue] || 0) + 1;
                    }
                },
            );
        });

        setResultSummary(result);
        console.log("集計結果(resultSummary):", result); // デバッグ用ログ
    };

    useEffect(() => {
        if (!formId) return;
        // 全ての回答者のデータ(responseList)の取得
        const fetchResponseList = async () => {
            const responseListQuery = query(
                collection(db, "answers"),
                where("formId", "==", formId),
            );

            // snapshot = 特定の状態をコピーする変数の総称
            const responseListSnapshot = await getDocs(responseListQuery);
            console.log("responseListSnapshot:", responseListSnapshot); // デバッグ用ログ

            // 以下でデータを扱いやすいように変換
            const responseList = responseListSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(
                "全ての回答者の回答データ(responseList):",
                responseList,
            ); // デバッグ用ログ

            setResponseList(responseList);
            // aggregate = 集計
            aggregateResponses(responseList); // ← 集計処理
        };

        fetchResponseList();
    }, [formId]);

    return (
        <div>
            {/* 回答結果の表示 */}
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mb-10">
                {/* フォームタイトル・説明 */}
                <div className="border-b pb-4 mb-4">
                    <h2 className="w-full px-3 py-1 font-bold text-3xl">
                        {formData.title}
                    </h2>
                    <h3 className="w-full px-3 py-1 font-medium">
                        {formData.description}
                    </h3>
                </div>
                {/* <div className="w-full h-80 mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#2563eb"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div> */}
                {/* 回答データ表示 */}
                <div className="border rounded p-4 mb-4">
                    <h2 className="text-2xl font-bold text-center">回答総数</h2>
                    <h1 className="text-9xl font-bold text-center">
                        {responseList.length}
                    </h1>
                </div>

                {/* 回答者がいない場合のメッセージ */}
                {responseList.length === 0 ? (
                    <div>まだ回答がありません</div>
                ) : (
                    questions.map((question, index) => {
                        const questionId = question.id;
                        const values = resultSummary[questionId] || {}; // 集計結果がない場合は空オブジェクト
                        return (
                            <div
                                key={question}
                                className="border rounded p-4 mb-4"
                            >
                                <h3 className="font-semibold">
                                    設問 {index + 1}
                                </h3>
                                <h2 className="font-semibold mb-4 border-b pb-2 border-gray-300">
                                    {question.questionTitle}
                                </h2>

                                <RenderResultByQuestionType
                                    questionType={question.questionType}
                                    values={values}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
export default Result;
