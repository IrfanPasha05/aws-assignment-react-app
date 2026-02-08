import React, { useState, useEffect } from "react";
import "./App.css";

const originalQuestions = [
  { question: "EC2 stands for?", options: ["Elastic Compute Cloud","Easy Compute Cloud","Elastic Container Cloud","Extra Compute Cloud"], answer: "Elastic Compute Cloud" },
  { question: "AWS storage service?", options: ["S3","EC2","IAM","VPC"], answer: "S3" },
  { question: "Serverless service?", options: ["Lambda","EC2","RDS","EBS"], answer: "Lambda" },
  { question: "NoSQL database?", options: ["DynamoDB","MySQL","PostgreSQL","Oracle"], answer: "DynamoDB" },
  { question: "AWS CDN?", options: ["CloudFront","Route53","IAM","SNS"], answer: "CloudFront" },
  { question: "DNS service?", options: ["Route53","S3","EC2","CloudWatch"], answer: "Route53" },
  { question: "Monitoring service?", options: ["CloudWatch","IAM","VPC","S3"], answer: "CloudWatch" },
  { question: "Queue service?", options: ["SQS","SNS","EC2","Lambda"], answer: "SQS" },
  { question: "Permission service?", options: ["IAM","EC2","RDS","S3"], answer: "IAM" },
  { question: "Relational DB?", options: ["RDS","DynamoDB","S3","Lambda"], answer: "RDS" }
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore") || 0);

  useEffect(() => {
    const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    if (timer === 0) nextQuestion();
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, loggedIn]);

  const login = (e) => {
    e.preventDefault();
    if (e.target.username.value === "irfan" && e.target.password.value === "123")
      setLoggedIn(true);
    else alert("Wrong credentials");
  };

  const nextQuestion = () => {
    setSelected(null);
    setTimer(15);
    setIndex(i => i + 1);
  };

  const checkAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === questions[index].answer) setScore(s => s + 1);
    setTimeout(nextQuestion, 1500);
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setQuestions([...originalQuestions].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
  const saved = localStorage.getItem("highScore") || 0;
  if (score > saved) {
    localStorage.setItem("highScore", score);
    setHighScore(score);
  }
}, [score]);


  if (!loggedIn) {
    return (
      <div className={theme}>
        <div className="login">
          <h1>AWS Assignment Login</h1>
          <button onClick={() => setTheme(theme==="dark"?"light":"dark")}>Toggle Theme</button>
          <form onSubmit={login}>
            <input name="username" placeholder="Username"/>
            <input name="password" type="password" placeholder="Password"/>
            <button>Login</button>
          </form>
        </div>
      </div>
    );
  }

  if (index >= questions.length) {
    return (
      <div className={theme}>
        <div className="quiz">
          <h1>Quiz Completed 🎉</h1>
          <h2>Score: {score}/10</h2>
          <h2>High Score: {highScore}</h2>
          <button onClick={restartQuiz}>Restart</button>
        </div>
      </div>
    );
  }

  const progress = (index / questions.length) * 100;

  return (
    <div className={theme}>
      <div className="quiz">
        <button onClick={() => setTheme(theme==="dark"?"light":"dark")}>Toggle Theme</button>
        <h3>Time: {timer}s</h3>
        <div className="progress">
          <div className="progress-bar" style={{width:progress+"%"}}></div>
        </div>

        <h2>{questions[index].question}</h2>

        {questions[index].options.map(opt => (
          <button
            key={opt}
            className={
              selected && opt === questions[index].answer ? "correct" :
              selected && opt === selected ? "wrong" : ""
            }
            onClick={() => checkAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}


