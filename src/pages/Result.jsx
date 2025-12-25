import { useParams } from "react-router-dom";
import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

// コンポーネント
import Menu from "../components/Menu";
import RenderResultByQuestionType from "../components/renderResultByQuestionType";

const Result = () => {
    // ルーティングパラメータ(URL)から formId を取得
    const { formId } = useParams();

    const [responseList, setResponseList] = useState([]);
    const [resultSummary, setResultSummary] = useState({}); // ← 集計結果
    const [questions, setQuestions] = useState([]);

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
                questionAnswers
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
                }
            );
        });

        setResultSummary(result);
        console.log("集計結果(resultSummary):", result); // デバッグ用ログ
    };

    useEffect(() => {
        // 全ての回答者のデータ(responseList)の取得
        const fetchResponseList = async () => {
            const responseListQuery = query(
                collection(db, "answers"),
                where("formId", "==", formId)
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
                responseList
            ); // デバッグ用ログ

            setResponseList(responseList);
            // aggregate = 集計
            aggregateResponses(responseList); // ← 集計処理
        };

        // 設問データをformIDから取得、タイトルや設問タイプの表示に使用
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

        fetchResponseList();
        fetchQuestions();
    }, [formId]);

    // 設問IDに対応する設問データを取得する関数
    const getQuestionById = (questionId) => {
        return questions.find((q) => q.id === questionId);
    };

    // 設問IDに対応する設問タイトルを取得する関数
    const getQuestionTitle = (questionId) => {
        const question = getQuestionById(questionId);
        return question ? question.questionTitle : "不明な設問";
    };

    // 設問IDに対応する設問タイプを取得する関数
    const getQuestionType = (questionId) => {
        const question = getQuestionById(questionId);
        return question ? question.questionType : "不明な設問タイプ";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Menu />
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-8 mb-10">
                <h1 className="text-2xl font-bold mb-6">回答結果</h1>
                <h2 className="text-xl font-bold mb-4">
                    回答総数：{responseList.length}
                </h2>

                {/* 回答者がいない場合のメッセージ */}
                {responseList.length === 0 ? (
                    <div>まだ回答がありません</div>
                ) : (
                    Object.entries(resultSummary).map(
                        ([questionId, values]) => (
                            // valuesの例 {ダンス部: 3}
                            <div
                                key={questionId}
                                className="border rounded p-4 mb-4"
                            >
                                <h2 className="font-semibold mb-2">
                                    {getQuestionTitle(questionId)}
                                </h2>

                                <RenderResultByQuestionType
                                    questionType={getQuestionType(questionId)}
                                    values={values}
                                />
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default Result;
