import Question from "./Question";

const Questions = ({
    questionsData,
    updateQuestionData,
    deleteQuestion,
    published,
}) => {
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
                        published={published}
                    />
                ))
            }
        </>
    );
};

export default Questions;
