import { useState } from "react";
import { CommentType } from "../components/CommentSection";
import Data from "../assets/data.json";

const initComments: CommentType[] = Data.comments;

const searchReply = (replies: CommentType[], comment: CommentType): number => {
  const replyingComment = replies.filter(
    (reply) =>
      reply.id === comment.replyingToId ||
      searchReply(reply.replies, comment) !== -1
  );
  if (replyingComment.length === 0) return -1;
  return replyingComment[0].id;
};

const addReplies = (
  replies: CommentType[],
  comment: CommentType,
  commentId: number
): CommentType[] => {
  if (commentId === -1) return [comment, ...replies];
  const updatedComments = replies.map((reply) => {
    if (reply.id === commentId) {
      const newReply = [comment, ...reply.replies];
      reply.replies = newReply;
      return reply;
    } else if (reply.replies.length > 0) {
      const newReply = addReplies(reply.replies, comment, commentId);
      reply.replies = newReply;
      return reply;
    }
    return reply;
  });

  return updatedComments;
};

const deleteReplies = (replies: CommentType[], commentId: number) => {
  if (commentId === -1) return replies;
  const updatedComments = replies.filter((reply) => {
    if (reply.id === commentId) return false;
    else if (reply.replies.length > 0) {
      const newReply = deleteReplies(reply.replies, commentId);
      reply.replies = newReply;
      return true;
    }
    return true;
  });
  return updatedComments;
};

export default function useCommentReply() {
  const [comments, setComments] = useState<CommentType[]>(initComments);
  const [deleting, setDeleting] = useState(false);
  const addReply = (comment: CommentType) => {
    const newComments = [...comments];
    const commentId = searchReply(newComments, comment);
    // const commentId = comment.replyingToId;
    const updatedComments = addReplies(newComments, comment, commentId);
    setComments(updatedComments);
  };

  const deleteComment = (commentId: number) => {
    const newComments = [...comments];
    const updatedComments = deleteReplies(newComments, commentId);
    setComments(updatedComments);
    setDeleting(false);
  };

  return { comments, addReply, deleting, setDeleting, deleteComment };
}
