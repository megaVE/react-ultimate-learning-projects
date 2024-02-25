function Progress({ index, numberOfQuestions, points, maxPossiblePoints, hasAnswer }) {
  return (
    <header className="progress">
      <progress max={numberOfQuestions} value={index + Number(hasAnswer)}></progress>
      <p>Question <strong>{index + 1}</strong> / {numberOfQuestions}</p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
};
export default Progress;
