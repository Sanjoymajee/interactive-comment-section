import Comment from "./Comment";
import Data from "../assets/data.json";
import { useCommentReply } from "../Hooks/UseCommentReply";

export interface CommentType {
  id: number;
  content: string;
  createdAt: Date | string;
  score: number;
  replyingTo: string;
  replyingToId: number;
  user: UserType;
  replies: CommentType[];
}

export interface UserType {
  image: {
    png: string;
    webp: string;
  };
  username: string;
  postsUpvoted: number[];
  postsDownvoted: number[];
}

export const currentUser: UserType = Data.currentUser;

export default function CommentSection() {
  const { comments, addReply } = useCommentReply();
  const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.comment.value) return;
    const newComment: CommentType = {
      id: Date.now(),
      content: e.currentTarget.comment.value,
      createdAt: new Date(),
      score: 0,
      replyingTo: "",
      replyingToId: 0,
      user: currentUser,
      replies: [],
    };
    addReply(newComment);
    e.currentTarget.comment.value = "";
  };

  return (
    <div className="comment_section">
      {comments.map((comment: CommentType) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div className="reply_box">
        <form action="POST" onSubmit={(e) => addComment(e)}>
          <div className="reply_content">
            <img src={currentUser.image.png} alt={currentUser.username} />
            <textarea
              name="comment"
              placeholder="Add a comment..."
              autoComplete="off"
            ></textarea>
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
