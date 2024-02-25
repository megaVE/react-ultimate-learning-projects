function NextButton({ toNextQuestion, type }) {
  return (
    <button className="btn btn-ui" onClick={toNextQuestion}>{type}</button>
  );
};
export default NextButton;
