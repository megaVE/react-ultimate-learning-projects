function FinishScreen({ points, maxPossiblePoints, highscore, handleRestart }) {
  const percentage = points / maxPossiblePoints * 100;

  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">
        (Highscore: {highscore} points)
      </p>
      <button
        className="btn btn-ui"
        onClick={handleRestart}
      >Restart quiz</button>
    </>
  )
}

export default FinishScreen;
