// rechartsのインポート
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// 設問タイプに応じた表示を返すコンポーネント
// renderとは「表示する」という意味
const RenderResultByQuestionType = ({ questionType, values }) => {
    // Rechartsが要求するデータ形式に変換する関数
    const convertToPieData = (values) => {
        return Object.entries(values).map(([key, value]) => ({
            name: key,
            value: value,
        }));
    };

    // チャートの色の配列
    const chartColors = [
        "#3366CC",
        "#DC3912",
        "#FF9900",
        "#109618",
        "#990099",
        "#0099C6",
        "#DD4477",
        "#66AA00",
        "#B82E2E",
        "#316395",
        "#994499",
        "#22AA99",
        "#AAAA11",
        "#6633CC",
        "#E67300",
        "#8B0707",
        "#329262",
        "#5574A6",
        "#3B3EAC",
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
                            data={convertToPieData(values)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={160}
                            label={renderLabel} // ラベルをパーセント表示にする
                        >
                            {convertToPieData(values).map((_, index) => (
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

        case "ドロップダウン":
        case "チェックボックス":
            return (
                <ul className="space-y-1">
                    {Object.entries(values).map(([answer, count]) => (
                        <li key={answer} className="flex justify-between">
                            <span>{answer}</span>
                            <span>{count} 件</span>
                        </li>
                    ))}
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
