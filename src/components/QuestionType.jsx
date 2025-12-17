import { useState } from "react";

import { MdRadioButtonChecked } from "react-icons/md"; // ラジオボタンアイコン
import { MdOutlineCheckBox } from "react-icons/md"; //チェックボックスアイコン
import { MdOutlineArrowDropDownCircle } from "react-icons/md"; // ドロップダウンアイコン
import { BiAlignLeft } from "react-icons/bi"; // テキストアイコン

// 質問タイプのドロップダウン管理

const QuestionType = ({ questionData, updateQuestionData, className = "" }) => {
    const [open, setOpen] = useState(false);

    const getIcon = (type) => {
        switch (type) {
            case "チェックボックス":
                return <MdOutlineCheckBox />;
            case "プルダウン":
                return <MdOutlineArrowDropDownCircle />;
            case "テキスト":
                return <BiAlignLeft />;
            case "ラジオボタン":
            default:
                return <MdRadioButtonChecked />;
        }
    };

    const selectType = (type) => {
        updateQuestionData({
            ...questionData,
            questionType: type,
        });
        setOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 border rounded w-full flex items-center justify-between"
            >
                <span className="flex items-center gap-2">
                    {getIcon(questionData.questionType)}{" "}
                    {questionData.questionType}
                </span>
                ▾
            </button>
            {open && (
                <ul className="absolute z-10 bg-white border rounded w-full mt-1 divide-y divide-gray-300 shadow-lg">
                    <li
                        onClick={() => {
                            selectType("ラジオボタン");
                        }}
                        className="p-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <MdRadioButtonChecked /> ラジオボタン
                    </li>
                    <li
                        onClick={() => {
                            selectType("チェックボックス");
                        }}
                        className="p-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <MdOutlineCheckBox /> チェックボックス
                    </li>
                    <li
                        onClick={() => {
                            selectType("プルダウン");
                        }}
                        className="p-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <MdOutlineArrowDropDownCircle /> プルダウン
                    </li>
                    <li
                        onClick={() => {
                            selectType("テキスト");
                        }}
                        className="p-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <BiAlignLeft /> テキスト
                    </li>
                </ul>
            )}
        </div>
    );
};

export default QuestionType;
