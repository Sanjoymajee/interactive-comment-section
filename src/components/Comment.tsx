import "../styles/Comment.css";
import Score from "./Score";
import ReplyBox from "./ReplyBox";
import { useState } from "react";
import { CommentType, currentUser } from "./CommentSection";
import useCommentReply from "../Hooks/UseCommentReply";
// import useCommentReply from "../Hooks/UseCommentReply";

const getTimeAgo = (currentTime: Date, createdAt: Date): string => {
  const timeDiff = currentTime.getTime() - createdAt.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return "now";
  }
};

interface CommentProps {
  comment: CommentType;
  addReply: (comment: CommentType) => void;
  onDelete: (commentId: number) => void;
}

export default function Comment({ comment, addReply, onDelete }: CommentProps) {
  const [showMore, setShowMore] = useState(false);
  const [replying, setReplying] = useState(false);
  const user = comment.user;
  const { deleting, setDeleting } = useCommentReply();

  return (
    <div className="comment_reply">
      {deleting && (
        <div className="delete_model">
          <div className="delete_model_content">
            <h2>Delete Comment</h2>
            <p>
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone
            </p>
            <div className="buttons">
              <button className="cancel" onClick={() => setDeleting(false)}>
                Cancel
              </button>
              <button className="delete" onClick={() => onDelete(comment.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="comment">
        <Score score={comment.score} />
        <div className="comment_content">
          <div className="__header">
            <div className="user_details">
              <img src={user.image.png} alt={user.username} />
              <a href="#">
                <h3>{user.username}</h3>
              </a>
              {comment.user.username === currentUser.username && (
                <span className="user_tag">You</span>
              )}
              {typeof comment.createdAt === "string" ? (
                <span className="comment_time">{comment.createdAt}</span>
              ) : (
                <span className="comment_time">
                  {getTimeAgo(new Date(), comment.createdAt)}
                </span>
              )}
            </div>
            {comment.user.username === currentUser.username ? (
              <div className="edit_buttons">
                <button id="del-button" onClick={() => setDeleting(true)}>
                  <img src="/images/icon-delete.svg" alt="delete-icon" />
                  Delete
                </button>
                <button id="edit-button">
                  <img src="/images/icon-edit.svg" alt="edit-icon" />
                  Edit
                </button>
              </div>
            ) : (
              <div className="reply_button">
                <button onClick={() => setReplying((prev) => !prev)}>
                  <img src="/images/icon-reply.svg" alt="icon-reply" />
                  Reply
                </button>
              </div>
            )}
          </div>
          <div className="comment_text">
            {comment.content.length > 300 && !showMore ? (
              <span>
                <p>
                  {comment.content.slice(0, 300)}...
                  <button onClick={() => setShowMore(true)}>Show More</button>
                </p>
              </span>
            ) : (
              <span>
                <p>
                  {comment.content}
                  {comment.content.length > 300 && (
                    <button onClick={() => setShowMore(false)}>
                      Show Less
                    </button>
                  )}
                </p>
              </span>
            )}
          </div>
        </div>
      </div>
      {replying ? (
        <ReplyBox
          currentUser={currentUser}
          comment={comment}
          addReply={addReply}
        />
      ) : null}
      <div className="reply_container">
        {comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            addReply={addReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
