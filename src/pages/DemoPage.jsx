import { useState } from "react";
import AnswerView from "../components/AnswerView";
import RenderResultByQuestionType from "../components/renderResultByQuestionType";
import Questions from "../components/Questions";
import AddQuestionBtn from "../components/AddQuestionBtn";
import { MdLockOutline } from "react-icons/md";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// ── モックデータ ──────────────────────────────────────────
const DEMO_QUESTIONS = [
    {
        id: "q1",
        questionTitle: "このアプリの第一印象はいかがでしたか？",
        questionType: "ラジオボタン",
        options: ["とても良い", "良い", "普通", "改善が必要"],
        required: true,
    },
    {
        id: "q2",
        questionTitle: "使ってみたい機能を選んでください（複数可）",
        questionType: "チェックボックス",
        options: ["リアルタイム集計", "QRコード共有", "匿名回答", "CSV出力"],
        required: false,
    },
    {
        id: "q3",
        questionTitle: "アンケートツールをどのくらいの頻度で使いますか？",
        questionType: "プルダウン",
        options: ["毎日", "週に数回", "月に数回", "ほぼ使わない"],
        required: false,
    },
    {
        id: "q4",
        questionTitle: "ご意見・ご感想をお聞かせください",
        questionType: "テキスト",
        options: [],
        required: false,
    },
];

const DEMO_FORM = {
    id: "demo",
    title: "新機能・UXに関するアンケート",
    description:
        "ユーザーの皆様のご意見をお聞かせください。所要時間は約1分です。",
    published: true,
    shuffleQuestions: false,
    restrictToOneResponse: false,
    questions: DEMO_QUESTIONS,
};

const DEMO_RESULT_SUMMARY = {
    q1: { とても良い: 9, 良い: 6, 普通: 3, 改善が必要: 2 },
    q2: { リアルタイム集計: 14, QRコード共有: 11, 匿名回答: 8, CSV出力: 6 },
    q3: { 毎日: 4, 週に数回: 8, 月に数回: 6, ほぼ使わない: 2 },
    q4: {
        シンプルで直感的なUIが好きです: 1,
        QRコードでの共有がとても便利でした: 1,
        もっと質問の種類が増えると嬉しいです: 1,
        リアルタイムで結果が見られるのが良いですね: 1,
        スマホからでも使いやすかったです: 1,
    },
};

const DEMO_RESPONSE_COUNT = 20;

const DEMO_CHART_DATA = [
    { time: "10:00", count: 2 },
    { time: "10:15", count: 5 },
    { time: "10:30", count: 8 },
    { time: "10:45", count: 11 },
    { time: "11:00", count: 14 },
    { time: "11:15", count: 17 },
    { time: "11:30", count: 20 },
];

// ── タブ定義 ──────────────────────────────────────────────
const TABS = [
    { key: "edit", label: "編集" },
    { key: "answer", label: "回答" },
    { key: "result", label: "集計結果" },
];

// ── メインコンポーネント ──────────────────────────────────
const DemoPage = () => {
    const [tab, setTab] = useState("answer");
    const [answers, setAnswers] = useState({});
    const [voted, setVoted] = useState(false);
    const [localFormData, setLocalFormData] = useState(DEMO_FORM);

    // 回答タブ用
    const updateAnswer = (questionId, value, checked) => {
        setAnswers((prev) => {
            if (typeof checked === "undefined") {
                return { ...prev, [questionId]: value };
            }
            const current = Array.isArray(prev[questionId])
                ? prev[questionId]
                : [];
            if (checked) {
                return current.includes(value)
                    ? prev
                    : { ...prev, [questionId]: [...current, value] };
            } else {
                return {
                    ...prev,
                    [questionId]: current.filter((v) => v !== value),
                };
            }
        });
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length === 0) {
            return alert("回答が入力されていません。");
        }
        setVoted(true);
    };

    const resetAnswer = () => {
        setAnswers({});
        setVoted(false);
    };

    // 編集タブ用
    const updateQuestionData = (id, newData) => {
        setLocalFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => (q.id === id ? newData : q)),
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            id: crypto.randomUUID(),
            questionTitle: "",
            questionType: "ラジオボタン",
            options: ["", ""],
            required: false,
        };
        setLocalFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    const deleteQuestion = (id) => {
        setLocalFormData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* デモバナー */}
            <div className="bg-[#00468B] text-white text-center py-2 text-sm font-semibold tracking-wide">
                DEMO MODE — データは保存されません
            </div>

            {/* タブバー */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto flex">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
                                tab === t.key
                                    ? "border-[#00468B] text-[#00468B]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 編集タブ */}
            {tab === "edit" && (
                <div className="py-6 px-4">
                    <div className="bg-slate-200 shadow-md rounded-lg px-6 pt-6 pb-1 mx-auto w-[min(calc(100%-2rem),800px)]">
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 mb-5">
                            <MdLockOutline className="text-xl shrink-0 mt-0.5 text-amber-500" />
                            <div>
                                <p className="font-semibold text-sm">
                                    デモモードのため保存はできません
                                </p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    質問の追加・編集・削除はローカルで動作します。
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={localFormData.title}
                                onChange={(e) =>
                                    setLocalFormData({
                                        ...localFormData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded font-semibold text-2xl"
                                placeholder="タイトルを入力してください"
                            />
                            <textarea
                                className="w-full p-3 border rounded mb-4 font-medium resize-none"
                                placeholder="説明を入力してください"
                                rows={1}
                                value={localFormData.description}
                                onChange={(e) =>
                                    setLocalFormData({
                                        ...localFormData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <Questions
                            questionsData={localFormData.questions}
                            updateQuestionData={updateQuestionData}
                            deleteQuestion={deleteQuestion}
                            published={false}
                        />
                        <AddQuestionBtn addQuestion={addQuestion} />

                        <div className="py-4 flex justify-end">
                            <button
                                onClick={() =>
                                    alert("デモモードでは保存できません")
                                }
                                className="px-6 py-2 rounded-full bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
                            >
                                保存（デモ）
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 回答タブ */}
            {tab === "answer" && (
                <div>
                    {voted && (
                        <div className="max-w-2xl mx-auto mt-4 px-4">
                            <button
                                onClick={resetAnswer}
                                className="w-full py-2 rounded-xl bg-white border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
                            >
                                もう一度回答する（デモ用リセット）
                            </button>
                        </div>
                    )}
                    <AnswerView
                        form={DEMO_FORM}
                        updateAnswer={updateAnswer}
                        handleSubmit={handleSubmit}
                        Preview={false}
                        voted={voted}
                    />
                </div>
            )}

            {/* 集計結果タブ */}
            {tab === "result" && (
                <div className="py-6 px-4">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mb-6">
                        <div className="border-b border-gray-300 pb-4 mb-6">
                            <h2 className="font-bold text-2xl text-gray-900 px-1">
                                {DEMO_FORM.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 px-1">
                                {DEMO_FORM.description}
                            </p>
                        </div>

                        {/* 回答総数 */}
                        <div className="bg-[#00468b] rounded-xl p-5 mb-6 flex items-center justify-between">
                            <span className="text-white font-semibold text-lg">
                                回答総数
                            </span>
                            <span className="text-white font-bold text-6xl leading-none">
                                {DEMO_RESPONSE_COUNT}
                            </span>
                        </div>

                        {/* 累積グラフ */}
                        <div className="mb-6">
                            {/* <h3 className="text-sm font-semibold text-gray-600 mb-2">回答数の推移</h3>
                            <div className="w-full h-48 border rounded border-gray-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={DEMO_CHART_DATA}
                                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#00468b"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div> */}
                        </div>

                        {/* 設問ごとの集計 */}
                        <div className="space-y-4">
                            {DEMO_FORM.questions.map((question, index) => (
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
                                        values={
                                            DEMO_RESULT_SUMMARY[question.id] ||
                                            {}
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoPage;
