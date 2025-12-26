const PublishToggle = ({ published, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`w-12 h-7 rounded-full flex items-center px-1 transition
                ${published ? "bg-green-500" : "bg-gray-300"}`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition
                    ${published ? "translate-x-5" : ""}`}
            />
        </button>
    );
};
export default PublishToggle;
