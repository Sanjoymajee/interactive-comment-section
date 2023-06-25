import { useState } from "react";
import "../styles/Score.css";

interface ScoreProps {
  score: number;
}

export default function Score({ score }: ScoreProps) {
  const [currentScore, setCurrentScore] = useState(score);

  return (
    <div className="score">
      <button onClick={() => setCurrentScore(currentScore + 1)}>
        <img src="/images/icon-plus.svg" alt="plus" />
      </button>
      <span>{currentScore}</span>
      <button onClick={() => setCurrentScore(currentScore - 1)}>
        <img src="/images/icon-minus.svg" alt="minus" />
      </button>
    </div>
  );
}
