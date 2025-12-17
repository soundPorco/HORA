import { FaToggleOff } from "react-icons/fa6";
import { FaToggleOn } from "react-icons/fa";

const RequiredToggle = ({ data, updateQuestionData }) => {
    const toggleRequired = () => {
        updateQuestionData(data.id, {
            ...data,
            required: !data.required,
        });
    };

    return (
        <button
            onClick={toggleRequired}
            className={`
                flex items-center gap-1
                px-3 py-1 rounded-full
                border transition-all duration-300
                ${
                    data.required
                        ? "bg-red-400 text-white border-red-400"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                }
            `}
        >
            <span
                className={`
                    text-xl transition-transform duration-300
                    
                `}
            >
                {data.required ? <FaToggleOn /> : <FaToggleOff />}
            </span>
            <span className="text-sm font-medium">必須</span>
        </button>
    );
};

export default RequiredToggle;
