import "../styles/Comment.css";
import Score from "./Score";
import ReplyBox from "./ReplyBox";
import { useState } from "react";
import { CommentType, currentUser } from "./CommentSection";
import { useCommentReply } from "../Hooks/UseCommentReply";
import { getTimeAgo } from "../utils/CommentServices";

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  const [showMore, setShowMore] = useState(false);
  const [replying, setReplying] = useState(false);
  const user = comment.user;
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentText, setCommentText] = useState(comment.content);
  const { deleteComment, updateComment } = useCommentReply();

  const handleConfirmDeleteClick = (commentId: number) => {
    deleteComment(commentId);
  };

  const handleCancelDeleteClick = () => {
    setDeleting(false);
  };

  const onUpdate = () => {
    const { content, createdAt, ...rest } = comment;
    const newComment: CommentType = {
      content: commentText,
      createdAt: new Date(),
      ...rest,
    };
    updateComment(newComment);
    setEditing(false);
  };

  return (
    <div className="comment_reply">
      {deleting && (
        <div className="delete_backdrop">
          <div className="delete_model">
            <div className="delete_model_content">
              <div className="content_text">
                <h2>Delete Comment</h2>
                <p>
                  Are you sure you want to delete this comment? This will remove
                  the comment and can't be undone
                </p>
              </div>
              <div className="buttons">
                <button
                  className="cancel"
                  onClick={() => handleCancelDeleteClick()}
                >
                  No, Cancel
                </button>
                <button
                  className="delete"
                  onClick={() => handleConfirmDeleteClick(comment.id)}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="comment">
        <Score comment={comment} />
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
                <button id="edit-button" onClick={() => setEditing(true)}>
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
          {editing ? (
            <div className="editing_area">
              <textarea
                name="comment"
                id="edit-comment"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button onClick={() => onUpdate()}>Update</button>
            </div>
          ) : (
            <div className="comment_text">
              {commentText.length > 300 && !showMore ? (
                <span>
                  <p>
                    {commentText.slice(0, 300)}...
                    <button onClick={() => setShowMore(true)}>Show More</button>
                  </p>
                </span>
              ) : (
                <span>
                  <p>
                    {commentText}
                    {commentText.length > 300 && (
                      <button onClick={() => setShowMore(false)}>
                        Show Less
                      </button>
                    )}
                  </p>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {replying ? (
        <ReplyBox
          currentUser={currentUser}
          comment={comment}
          // addReply={addReply}
        />
      ) : null}
      <div className="reply_container">
        {comment.replies.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
      </div>
    </div>
  );
}
