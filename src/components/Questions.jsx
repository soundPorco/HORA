import Question from "./Question";

const Questions = ({ questionsData, updateQuestionData, deleteQuestion }) => {
    return (
        <>
            {
                /* ここにQuestionコンポーネントを追加していく */
                questionsData.map((questionData, index) => (
                    <Question
                        questionData={questionData}
                        index={index}
                        updateQuestionData={updateQuestionData}
                        deleteQuestion={deleteQuestion}
                    />
                ))
            }
        </>
    );
};

export default Questions;
