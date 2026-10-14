import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// 「累積回答数 × 時間」の折れ線グラフを描画するためのライブラリのインポート
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// コンポーネント
import RenderResultByQuestionType from "../components/renderResultByQuestionType"; // 設問タイプごとに集計結果の表示方法を切り替えるコンポーネント

const Result = () => {
    const { formData } = useOutletContext();
    const formId = formData.id;

    const [responseList, setResponseList] = useState([]);
    const [resultSummary, setResultSummary] = useState({}); // ← 集計結果
    const questions = formData.questions || [];

    const [cumulativeData, setCumulativeData] = useState([]); // 累積回答数のデータを格納する状態変数

    // ======================
    // 累積回答数のチャート描画用コンポーネント
    // ======================
    const ResultChart = ({ data }) => {
        return (
            <LineChart width={600} height={300} data={data}>
                <XAxis
                    dataKey="time"
                    tickFormatter={(t) => t.toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip labelFormatter={(t) => t.toLocaleString()} />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
        );
    };

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
            // ーーーーーーこの部分でresponseList内にvotedAtを含む回答データが確認できる ーーーーーー

            setResponseList(responseList);
            aggregateResponses(responseList);

            // ======================
            // チャート用：回答数の累積データを計算
            // ======================

            // ① 全回答者の回答日時を配列にする
            const votedAtList = responseList
                .map((response) => response.votedAt)
                .filter((votedAt) => votedAt != null);

            // ② 回答日時を昇順（古い順）にソート
            votedAtList.sort((a, b) => a.toMillis() - b.toMillis());
            // Firestoreの Timestamp は、toMillis() でミリ秒単位の数値に変換できる。この数値を比較することで、古い日時から順番に並べられる。

            // ③ 累積回答数のデータを作成
            const cumulativeData = votedAtList.map((votedAt, index) => ({
                votedAt: votedAt.toDate(),
                timestamp: votedAt.toMillis(),
                cumulativeCount: index + 1,
            }));

            setCumulativeData(cumulativeData);
            console.log("チャート用の累積回答数データ:", cumulativeData); // デバッグ用ログ
        };

        fetchResponseList();
    }, [formId]);

    return (
        <div>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mb-10">
                {/* フォームタイトル・説明 */}
                <div className="border-b border-gray-300 pb-4 mb-6">
                    <h2 className="font-bold text-2xl text-gray-900 px-1">
                        {formData.title}
                    </h2>
                    {formData.description && (
                        <p className="text-sm text-gray-500 mt-1 px-1">
                            {formData.description}
                        </p>
                    )}
                </div>

                {/* 回答総数 */}
                <div className="bg-[#00468b] rounded-xl p-5 mb-6 flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">
                        回答総数
                    </span>
                    <span className="text-white font-bold text-6xl leading-none">
                        {responseList.length}
                    </span>
                </div>
                {/* 累積回答数の折れ線グラフ */}
                <div className="bg-white rounded-xl p-5 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        累積回答数の推移
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={cumulativeData}>
                            <CartesianGrid
                                stroke="#eee"
                                strokeDasharray="5 5"
                            />

                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                domain={["dataMin", "dataMax"]}
                                tickFormatter={(timestamp) =>
                                    new Date(timestamp).toLocaleString(
                                        "ja-JP",
                                        {
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        },
                                    )
                                }
                            />

                            <YAxis
                                dataKey="cumulativeCount"
                                type="number"
                                domain={[0, "auto"]}
                            />

                            <Tooltip
                                labelFormatter={(timestamp) =>
                                    new Date(Number(timestamp)).toLocaleString(
                                        "ja-JP",
                                    )
                                }
                            />

                            <Line
                                type="linear"
                                dataKey="cumulativeCount"
                                stroke="#8884d8"
                                dot
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 回答者がいない場合 */}
                {responseList.length === 0 ? (
                    <div className="text-center py-10 text-gray-300">
                        <p className="text-sm">まだ回答がありません</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const questionId = question.id;
                            const values = resultSummary[questionId] || {};
                            return (
                                <div
                                    key={question.id}
                                    className="bg-slate-100 rounded-xl p-4"
                                >
                                    <span className="text-xs font-semibold text-[#00468b] uppercase tracking-wide">
                                        Q{index + 1}
                                    </span>
                                    <h2 className="font-semibold text-gray-800 mt-1 mb-4 pb-3 border-b border-gray-300">
                                        {question.questionTitle}
                                    </h2>
                                    <RenderResultByQuestionType
                                        questionType={question.questionType}
                                        values={values}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Result;
