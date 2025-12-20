import { useRef, useEffect } from "react";
import autosize from "autosize";

// アイコン
import { RiDeleteBin6Line } from "react-icons/ri";

// アンケート作成ページコンポーネント
import QuestionType from "../components/QuestionType";
import AddOptionBtn from "./AddOptionBtn";
import RemoveOptionBtn from "./RemoveOptionBtn";
import QuestionTypeIcon from "./QuestionTypeIcon";
import RequiredToggle from "./RequiredToggle";

const Question = ({
    questionData,
    index,
    updateQuestionData,
    deleteQuestion,
}) => {
    const data = questionData;

    // 設問タイトル変更
    const handleTitleChange = (e) => {
        updateQuestionData(data.id, { ...data, questionTitle: e.target.value });
    };
    // 設問削除
    const handleDelete = () => {
        confirm("この設問を削除しますか？") && deleteQuestion(data.id);
    };

    // 選択肢の内容変更
    const updateOptionValue = (index, value) => {
        const newOptions = [...data.options];
        newOptions[index] = value;

        updateQuestionData(data.id, { ...data, options: newOptions });
    };

    // 自動でテキストエリアの高さを調整するための設定
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);
    return (
        <>
            {/* Questions */}

            <div className="border p-4 my-5 rounded-lg text-center bg-white relative">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">設問 {index + 1}</h3>
                </div>
                <div className="flex items-center mb-3 justify-between">
                    <textarea
                        className="w-[67%] p-3 border rounded font-medium text-md resize-none"
                        placeholder="質問を入力してください"
                        rows={1}
                        ref={textareaRef}
                        value={data.questionTitle}
                        onChange={handleTitleChange}
                    />
                    <QuestionType
                        questionData={questionData}
                        updateQuestionData={(newData) =>
                            updateQuestionData(data.id, newData)
                        }
                        className="w-[32%]"
                    />
                </div>
                <div className="space-y-3">
                    {questionData.questionType === "テキスト" ? (
                        <textarea
                            rows={1}
                            placeholder="回答欄"
                            className="w-full p-2 border-b rounded resize-none"
                            disabled
                        />
                    ) : (
                        (data.options || []).map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <QuestionTypeIcon
                                    questionType={data.questionType}
                                    index={i}
                                />
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`選択肢 ${i + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                        updateOptionValue(i, e.target.value)
                                    }
                                    className="w-full p-2 border-b rounded"
                                />
                                <RemoveOptionBtn
                                    updateQuestionData={updateQuestionData}
                                    data={data}
                                    index={i}
                                />
                            </div>
                        ))
                    )}
                </div>
                <AddOptionBtn
                    updateQuestionData={updateQuestionData}
                    data={data}
                />
                <div className="flex gap-2 justify-end absolute bottom-5 right-5">
                    <RequiredToggle
                        data={data}
                        updateQuestionData={updateQuestionData}
                    />
                    <button
                        onClick={handleDelete}
                        className="text-xl text-gray-500 hover:text-white hover:bg-gray-500 duration-200 px-3 py-1 rounded-full
                border bg-gray-100  border-gray-300"
                    >
                        <RiDeleteBin6Line />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Question;
