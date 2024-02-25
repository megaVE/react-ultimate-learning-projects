import { useReducer, useEffect } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingSeconds: null,
};

function reducer(state, action) {
  switch(action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    
    case 'start':
      return {
        ...state,
        status: 'active',
        remainingSeconds: state.questions.length * SECS_PER_QUESTION,
      }
    
    case 'newAnswer':
      const question = state.questions.at(state.index);
      const isQuestionCorrect = action.payload === question.correctOption;

      return {
        ...state,
        answer: action.payload,
        points: isQuestionCorrect 
          ? state.points + question.points
          : state.points, 
      };

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore
          ? state.points
          : state.highscore,
      };

    case 'reset':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
      };
    
    case 'tick':
      return {
        ...state,
        remainingSeconds: state.remainingSeconds - 1,
        status: state.remainingSeconds <= 0
          ? 'finished'
          : state.status,
      };

    default:
      console.log("Errer", action);
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [{
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    remainingSeconds,
  }, dispatch] = useReducer(reducer, initialState);

  const hasAnswer = answer !== null
  const numberOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, question) => acc + question.points, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
    .then(res => res.json())
    .then(dataObject => dispatch( {
      type: 'dataReceived',
      payload: dataObject,
    }))
    .catch(() => dispatch({ type: 'dataFailed' }));
  }, [])

  return (


    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            handleStart={() => dispatch({ type: 'start' })}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numberOfQuestions={numberOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              hasAnswer={hasAnswer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                remainingSeconds={remainingSeconds}
              />
              {hasAnswer && (
                  index < numberOfQuestions - 1 ? (
                    <NextButton
                      toNextQuestion={() => {
                        dispatch({ type: 'nextQuestion' });
                      }}
                      type="Next"
                    />
                  ) : (
                    <NextButton
                      toNextQuestion={() => {
                        dispatch({ type: 'finish' });
                      }}
                      type="Finish"
                    />
                  )
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            handleRestart={() => dispatch({ type: 'restart' })}
          />
        )}
      </Main>
    </div>
  );
}
