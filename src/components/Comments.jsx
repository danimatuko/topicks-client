import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import CommentStore from "../stores/CommentStore";

const Comments = ({ postId, setEditComment, editComment }) => {
	const [comments, setComments] = useState([]);
	const [commentSuccsess, setCommentSuccsess] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await CommentStore.getAll(postId);
				setComments(data);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [postId, commentSuccsess, isDeleted]);

	return (
		<div className="comments w-75 mx-auto my-5 pb-3">
			<h2 className="display-6 mb-5">Comments ({comments.length})</h2>
			<h3 className="h5 fw-light">Add Your Comment</h3>
			<CommentForm
				commentSuccsess={commentSuccsess}
				setCommentSuccsess={setCommentSuccsess}
				editComment={editComment}
				setEditComment={setEditComment}

			/>
			{comments.map((comment) => (
				<Comment
					key={comment._id}
					comment={comment}
					setIsDeleted={setIsDeleted}
					setEditComment={setEditComment}
				/>
			))}
		</div>
	);
};

export default Comments;
