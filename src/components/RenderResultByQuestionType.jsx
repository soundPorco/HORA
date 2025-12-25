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

                    {/* 円グラフ表示 */}
                    <PieChart width={400} height={400} className="mx-auto">
                        <Pie
                            data={convertToChartData(values)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={160}
                            label={renderLabel} // ラベルをパーセント表示にする
                        >
                            {convertToChartData(values).map((_, index) => (
                                <Cell
                                    key={index}
                                    // 色の配列から順番に色を割り当てる、選択肢が多い場合は色がループする
                                    fill={
                                        chartColors[index % chartColors.length]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip /> {/* ホバー時のツールチップ */}
                        <Legend
                        // layout="vertical"
                        // align="right"
                        // verticalAlign="middle"
                        />
                        {/* 凡例 */}
                    </PieChart>
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

                    {/* 棒グラフ表示 */}
                    <div className="w-full h-80">
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
                                    top: 10,
                                    right: 30,
                                    left: 20,
                                    bottom: 10,
                                }}
                            >
                                <XAxis type="number" /> {/* 横軸は数値 */}
                                <YAxis dataKey="name" type="category" />
                                {/* 縦軸はカテゴリ */}
                                <Tooltip /> {/* ホバー時のツールチップ */}
                                <Bar dataKey="value" fill="#3e65a4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ul>
            );

        case "テキスト":
            return (
                <div className="text-sm text-gray-500">
                    ※ 記述式回答は集計対象外です
                </div>
            );

        default:
            return <div className="text-red-500">未対応の設問タイプ</div>;
    }
};

export default RenderResultByQuestionType;
