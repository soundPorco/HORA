const PublishToggle = ({ published, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`w-16 h-8 rounded-full flex items-center px-1 transition
                ${published ? "bg-green-500" : "bg-gray-300"}`}
        >
            <div
                className={`w-6 h-6 bg-white rounded-full shadow transform transition
                    ${published ? "translate-x-8" : ""}`}
            />
        </button>
    );
};
export default PublishToggle;
