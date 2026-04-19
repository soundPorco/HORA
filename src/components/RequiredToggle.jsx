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
            className={`mt-12 transition-all duration-200 flex items-center gap-2${data.required ? " text-red-400 hover:text-red-500" : " text-gray-400 hover:text-gray-500"}`}
        >
            {/* <div className="font-semibold">必須</div> */}
            {data.required ? (
                <FaToggleOn className="text-3xl" />
            ) : (
                <FaToggleOff className="text-3xl" />
            )}
        </button>
    );
};

export default RequiredToggle;
