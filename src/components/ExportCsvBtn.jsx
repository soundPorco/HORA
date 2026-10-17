import { TbDownload } from "react-icons/tb";

const ExportCsvBtn = ({ responseList, formData }) => {
    // ------------------------------
    // ① 回答をCSVのセルに変換する関数
    // ------------------------------
    const formatCsvCell = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        // チェックボックスなど、複数回答は1つのセルにまとめる
        let text = Array.isArray(value)
            ? value.join(" / ")
            : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);

        // Excelで数式として実行されることを防ぐ
        if (/^[\t\r ]*[=+\-@]/.test(text)) {
            text = "'" + text;
        }

        // ダブルクォートをエスケープし、セル全体を引用符で囲む
        return `"${text.replace(/"/g, '""')}"`;
    };

    // ------------------------------
    // ② CSVファイルを生成してダウンロードする関数
    // ------------------------------
    // 回答がなければ出力しない
    const handleExportCsv = () => {
        if (responseList.length === 0) {
            alert("出力できる回答データがありません。");
            return;
        }

        // アンケートの設問一覧
        const questions = formData.questions || [];

        // CSVの1行目：ヘッダー
        const headers = [
            "回答日時",
            ...questions.map(
                (question) =>
                    question.title ??
                    question.questionTitle ??
                    question.text ??
                    question.id,
            ),
        ];

        // 2行目以降：回答データ
        const rows = responseList.map((response) => {
            const votedAt = response.votedAt?.toDate
                ? response.votedAt.toDate()
                : response.votedAt instanceof Date
                  ? response.votedAt
                  : null;

            const dateText = votedAt
                ? votedAt.toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                  })
                : "";

            const answers = response.answers || {};

            const answerValues = questions.map((question) =>
                formatCsvCell(answers[question.id]),
            );

            return [formatCsvCell(dateText), ...answerValues];
        });

        // ヘッダーと回答データをCSV文字列に変換
        const csvContent = [
            headers.map(formatCsvCell).join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\r\n");

        // UTF-8 BOMを付け、日本語がExcelで文字化けしにくくする
        const bom = "\uFEFF";
        const blob = new Blob([bom + csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        // ダウンロード用のURLを作成
        const url = URL.createObjectURL(blob);

        // ファイル名を作成
        const today = new Date().toISOString().slice(0, 10);
        const formTitle = (formData.title || "アンケート").replace(
            /[\\/:*?"<>|]/g,
            "_",
        );

        const link = document.createElement("a");
        link.href = url;
        link.download = `${formTitle}_回答一覧_${today}.csv`;

        // ダウンロードを実行
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 作成したURLを解放
        URL.revokeObjectURL(url);
    };

    return (
        <button
            type="button"
            onClick={handleExportCsv}
            disabled={responseList.length === 0}
            className=" text-gray-600
             disabled:opacity-50
             disabled:cursor-not-allowed
             text-2xl rounded-full p-2 hover:bg-gray-200 duration-200 group
              relative"
        >
            {/* CSVをダウンロード */}
            <TbDownload />
            {/* hover時のツールチップ */}
            <span className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-600 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                CSVをダウンロード
            </span>
        </button>
    );
};

export default ExportCsvBtn;
