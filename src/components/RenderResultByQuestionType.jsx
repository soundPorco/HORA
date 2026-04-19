// rechartsのインポート
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

import CustomTooltip from "./CustomTooltip"; // カスタムツールチップコンポーネント

// 設問タイプに応じた表示を返すコンポーネント
// renderとは「表示する」という意味
const RenderResultByQuestionType = ({ questionType, values }) => {
    // Rechartsが要求するデータ形式に変換する関数
    const convertToChartData = (values) => {
        return Object.entries(values).map(([key, value]) => ({
            name: key,
            value: value,
        }));
    };

    // チャートの色の配列
    const chartColors = [
        "#4F46E5",
        "#EF4444",
        "#F59E0B",
        "#10B981",
        "#8B5CF6",
        "#06B6D4",
        "#EC4899",
        "#84CC16",
        "#F97316",
        "#3B82F6",
        "#A855F7",
        "#14B8A6",
        "#EAB308",
        "#6366F1",
        "#FB923C",
        "#DC2626",
        "#22C55E",
        "#60A5FA",
        "#9333EA",
    ];

    // 円グラフのラベル表示をパーセントに変換する関数
    // percentは0から1の値でrechartsから渡される、toFixed(0)で小数点以下を切り捨て
    const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

    switch (questionType) {
        case "ラジオボタン":
            return (
                <ul className="space-y-1">
                    {Object.entries(values).map(([answer, count]) => (
                        <li key={answer} className="flex justify-between">
                            <span>{answer}</span>
                            <span>{count} 件</span>
                        </li>
                    ))}

                    {/* グラフ表示エリアとのスペース */}
                    <div className="h-[20px]"></div>

                    {/* 円グラフ表示 */}
                    <div className="w-full border rounded border-gray-300">
                        <ResponsiveContainer width="100%" height={500}>
                            <PieChart
                                className="mx-auto"
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 30,
                                    left: 20,
                                }} // 下に余白を追加
                            >
                                <Pie
                                    data={convertToChartData(values)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={160}
                                    label={renderLabel} // ラベルをパーセント表示にする
                                >
                                    {convertToChartData(values).map(
                                        (_, index) => (
                                            <Cell
                                                key={index}
                                                // 色の配列から順番に色を割り当てる、選択肢が多い場合は色がループする
                                                fill={
                                                    chartColors[
                                                        index %
                                                            chartColors.length
                                                    ]
                                                }
                                            />
                                        ),
                                    )}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />{" "}
                                {/* ホバー時のツールチップ */}
                                <Legend
                                    margin={{ bottom: 500 }} // 凡例の下にマージンを追加
                                />
                                {/* 凡例 */}
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ul>
            );

        case "プルダウン":
        case "チェックボックス":
            return (
                <ul className="space-y-1">
                    {Object.entries(values).map(([answer, count]) => (
                        <li key={answer} className="flex justify-between">
                            <span>{answer}</span>
                            <span>{count} 件</span>
                        </li>
                    ))}
                    {/* グラフ表示エリアとのスペース */}
                    <div className="h-[20px]"></div>

                    {/* 棒グラフ表示 */}
                    <div className="w-full h-80 border rounded border-gray-300">
                        {/* <ResponsiveContainer>がないと表示されない場合があるらしい */}
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                            className="mx-auto"
                        >
                            <BarChart
                                data={convertToChartData(values)}
                                layout="vertical" // 横向きの棒グラフ
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 10,
                                    bottom: 20,
                                }}
                            >
                                <XAxis type="number" /> {/* 横軸は数値 */}
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={140}
                                    tickFormatter={(value) => {
                                        const maxLength = 10; // 最大表示文字数
                                        return value.length > maxLength
                                            ? `${value.slice(0, maxLength)}...`
                                            : value;
                                    }}
                                    tick={{ fontSize: 12, fill: "#333" }}
                                />
                                {/* 縦軸はカテゴリ */}
                                <Tooltip content={<CustomTooltip />} />{" "}
                                {/* ホバー時のツールチップ */}
                                <Bar dataKey="value" fill="#3e65a4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ul>
            );

        case "テキスト":
            return (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(values).map(([answer, count], index) => (
                        // break-all で長いテキストも改行して表示
                        <li
                            key={index}
                            className="bg-white border border-gray-150 px-3 py-2 rounded-md break-all"
                        >
                            {answer}{" "}
                            <span className="text-gray-500">({count} 件)</span>
                        </li>
                    ))}
                </ul>
            );

        default:
            return <div className="text-red-500">未対応の設問タイプ</div>;
    }
};

export default RenderResultByQuestionType;
