// import useCommentReply from "../Hooks/UseCommentReply";
import { useCommentReply } from "../Hooks/UseCommentReply";
import "../styles/ReplyBox.css";
import { CommentType, UserType } from "./CommentSection";

interface ReplyBoxProps {
  currentUser: UserType;
  comment: CommentType;
}

export default function ReplyBox({ currentUser, comment }: ReplyBoxProps) {
  const { addReply } = useCommentReply();
  const sendReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.comment.value) return;
    const newComment: CommentType = {
      id: Date.now(),
      content: e.currentTarget.comment.value,
      createdAt: new Date(),
      score: 0,
      replyingTo: comment.user.username,
      replyingToId: comment.id,
      user: currentUser,
      replies: [],
    };
    addReply(newComment);
    e.currentTarget.comment.value = "";
  };
  return (
    <div className="reply_box">
      <form action="POST" onSubmit={(e) => sendReply(e)}>
        <div className="reply_content">
          <img src={currentUser.image.png} alt={currentUser.username} />
          <textarea
            name="comment"
            placeholder="Add a comment..."
            autoFocus
          ></textarea>
          <button type="submit">Reply</button>
        </div>
      </form>
    </div>
  );
}
