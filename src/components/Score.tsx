import "../styles/Score.css";
import { CommentType, currentUser } from "./CommentSection";
import { useCommentReply } from "../Hooks/UseCommentReply";
import { useState } from "react";

interface ScoreProps {
  comment: CommentType;
}

export default function Score({ comment }: ScoreProps) {
  const { updateComment } = useCommentReply();
  const isUpvoted = currentUser.postsUpvoted.includes(comment.id);
  const isDownvoted = currentUser.postsDownvoted.includes(comment.id);
  const [upVoted, setUpVoted] = useState(isUpvoted);
  const [downVoted, setDownVoted] = useState(isDownvoted);

  const updateScore = (newScore: number, isUpvote: boolean) => {
    if (isUpvote) {
      if (upVoted) {
        setUpVoted(false);
        newScore--;
      } else {
        setUpVoted(true);
        newScore++;
        if (downVoted) {
          setDownVoted(false);
          newScore++;
        }
      }
    } else {
      if (downVoted) {
        setDownVoted(false);
        newScore++;
      } else {
        setDownVoted(true);
        newScore--;
        if (upVoted) {
          setUpVoted(false);
          newScore--;
        }
      }
    }
    return newScore;
  };

  const onVote = (newScore: number, isUpvote: boolean) => {
    const updatedScore = updateScore(newScore, isUpvote);
    const { score, ...rest } = comment;
    const newComment: CommentType = {
      score: updatedScore,
      ...rest,
    };
    updateComment(newComment);
  };
  return (
    <div className="score">
      <button onClick={() => onVote(comment.score, true)}>
        <img src="/images/icon-plus.svg" alt="plus" />
      </button>
      <span>{comment.score}</span>
      <button onClick={() => onVote(comment.score, false)}>
        <img src="/images/icon-minus.svg" alt="minus" />
      </button>
    </div>
  );
}
