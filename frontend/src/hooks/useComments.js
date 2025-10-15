import { useState } from "react";
import { getComments } from "../services/comments/getComments";
import { addComment } from "../services/comments/addComment";
import { updateComment } from "../services/comments/updateComment";
import { deleteComment } from "../services/comments/deleteComment";

function useComments() {

    const [comments, setComments] = useState([]);
    const [commentsError, setCommentsError] = useState(null);

    async function loadComments(clientID, skip=0, limit=10, ctx) {
        try {
            setCommentsError(null)
            const data = await getComments(clientID, skip, limit, ctx);
            setComments(data.comments);
        } catch(err) {
            setCommentsError(err.message);
            throw err;
        }
    }

    async function addNewComment(clientID, newComment, ctx) {
        try {
            setCommentsError(null)
            const data = await addComment(clientID, newComment, ctx);
            setComments((prev) => [data.comment, ...prev]);
        } catch(err) {
            setCommentsError(err.message);
            throw err;
        }
    }

    async function modifyComment(clientID, commentID, newComment, ctx) {
        try {
            setCommentsError(null)
            const data = await updateComment(clientID, commentID, newComment, ctx);
            setComments((prev) => prev.map((c) => c.id === commentID ? data.comment : c));
            return data.comment;
        } catch(err) {
            setCommentsError(err.message);
            throw err;
        }
    }

    async function removeComment(clientID, commentID, ctx) {
        try {
            setCommentsError(null)
            await deleteComment(clientID, commentID, ctx);
            // setComments((prev) => prev.filter((c) => c.id !== c
            const updatedFetch = await getComments(clientID, 0, 10, ctx);
            setComments(updatedFetch.comments)
        } catch(err) {
            setCommentsError(err.message);
            throw err;
        }
    }

    return {
        comments,
        commentsError,
        loadComments,
        addNewComment,
        modifyComment,
        removeComment,
    }
}

export default useComments;