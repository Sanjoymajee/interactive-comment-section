import { CommentType } from "../components/CommentSection";

export const updateComments = (
  comments: CommentType[],
  updatedComment: CommentType
) => {
  const updatedComments = comments.map((comment) => {
    if (comment.id === updatedComment.id) return updatedComment;
    else if (comment.replies.length > 0) {
      const newReply = updateComments(comment.replies, updatedComment);
      comment.replies = newReply;
      return comment;
    }
    return comment;
  });
  return updatedComments;
};

export const searchReply = (
  replies: CommentType[],
  comment: CommentType
): number => {
  const replyingComment = replies.filter(
    (reply) =>
      reply.id === comment.replyingToId ||
      searchReply(reply.replies, comment) !== -1
  );
  if (replyingComment.length === 0) return -1;
  return replyingComment[0].id;
};

export const addReplies = (
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

export const deleteReplies = (replies: CommentType[], commentId: number) => {
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

export const getTimeAgo = (currentTime: Date, createdAt: Date): string => {
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
