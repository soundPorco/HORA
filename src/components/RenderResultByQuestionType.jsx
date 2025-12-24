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
                    <PieChart width={300} height={300}>
                        <Pie
                            data={convertToPieData(values)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        />
                        <Tooltip />
                        <Legend />
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
