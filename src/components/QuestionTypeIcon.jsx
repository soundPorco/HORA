import { MdRadioButtonUnchecked } from "react-icons/md"; // ラジオボタンアイコン
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md"; //チェックボックスアイコン
import { MdOutlineArrowDropDownCircle } from "react-icons/md"; // ドロップダウンアイコン
import { BiAlignLeft } from "react-icons/bi"; // テキストアイコン

const QuestionTypeIcon = ({ questionType, index }) => {
    const getIcon = () => {
        switch (questionType) {
            case "チェックボックス":
                return <MdOutlineCheckBoxOutlineBlank />;
            case "プルダウン":
                return `${index + 1}.`;
            case "テキスト":
                return <BiAlignLeft />;
            case "ラジオボタン":
            default:
                return <MdRadioButtonUnchecked />;
        }
    };

    return <span className=" text-gray-400">{getIcon()}</span>;
};
export default QuestionTypeIcon;
