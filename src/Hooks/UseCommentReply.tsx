import { createContext, useContext, useState } from "react";
import { CommentType } from "../components/CommentSection";
import Data from "../assets/data.json";
import React from "react";
import {
  addReplies,
  deleteReplies,
  searchReply,
  updateComments,
} from "../utils/CommentServices";

interface CommentContextType {
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  addReply: (comment: CommentType) => void;
  deleteComment: (commentId: number) => void;
  updateComment: (comment: CommentType) => void;
}

const initComments: CommentType[] = Data.comments;

const CommentContext = createContext<CommentContextType>({
  comments: [],
  setComments: () => {},
  addReply: () => {},
  deleteComment: () => {},
  updateComment: () => {},
});

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [comments, setComments] = useState<CommentType[]>(initComments);
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
  };

  const updateComment = (comment: CommentType) => {
    const newComments = [...comments];
    const updatedComments = updateComments(newComments, comment);
    setComments(updatedComments);
  };

  return (
    <CommentContext.Provider
      value={{ comments, setComments, addReply, deleteComment, updateComment }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentReply = () => {
  const { comments, setComments, addReply, deleteComment, updateComment } =
    useContext(CommentContext);

  return { comments, addReply, deleteComment, setComments, updateComment };
};
