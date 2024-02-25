function Options({ question, dispatch, answer }) {
  const { options, correctOption } = question
  
  function createOptionClass(index) {
    let optionClass = "btn btn-option";
    
    if (answer !== null) {
      optionClass += (index === answer) ? " answer" : "";
      optionClass += (index === correctOption) ? " correct" : " wrong";
    }

    return optionClass;
  }
  
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={option}
          className={createOptionClass(index)}
          disabled={answer !== null}
          onClick={() => {
            dispatch({
              type: 'newAnswer',
              payload: index,
            });
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;
