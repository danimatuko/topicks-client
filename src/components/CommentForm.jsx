import { Editor } from "@tinymce/tinymce-react";
import React, { useContext, useState } from "react";
import { getDate } from "../helpers/getDate";
import { StoreContext } from "../stores/RootStore";
import { commentEditorConfig } from "../tinymce.config";
import { Alert, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { runInAction } from "mobx";
import CommentModel from "../stores/CommentStore";

const CommentForm = ({ commentSuccsess, setCommentSuccsess, setEditComment, editComment }) => {
	const { user, comment } = useContext(StoreContext);
	const { id } = useParams();

	const initialState = {
		id: comment.id,
		postId: id,
		userId: user.id,
		author: user.first_name + " " + user.last_name,
		commentBody: "",
		dateOfComment: getDate(),
		profileImage: user.profileImage
	};

	const [commentState, setCommentState] = useState(initialState);
	const [error, setError] = useState(null);

	const handleEditorChange = (e) => {
		setCommentState({ ...commentState, commentBody: e.target.getContent() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setCommentSuccsess(false);
		const { userId, author, commentBody, dateOfComment, profileImage } = commentState;

		runInAction(() => {
			comment.postId = id;
			comment.userId = userId;
			comment.author = author;
			comment.commentBody = commentBody;
			comment.dateOfComment = dateOfComment;
			comment.profileImage = profileImage;
		});

		try {
			if (!editComment) {
				const { data } = await comment.save(user.token);
				// after saving a comment get the id and save it in the store
				runInAction(() => (comment.id = data._id));
				// rerender the editor and comments on succsess
				data && setCommentSuccsess(true);
			} else {
				const { data } = await CommentModel.edit(comment, user.token);
				// rerender the editor and comments on succsess
				data && setCommentSuccsess(true);
			}
			// reset the editor initialValue
			setEditComment(null);
		} catch (error) {
			console.log({ error });
			setError(error.response.data.message);
		}
	};

	return (
		<div className="mb-5">
			{error && <Alert variant="danger">{error}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Editor
					key={commentSuccsess} // react key to rerneder the form on submit
					apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
					initialValue={editComment || ""}
					init={commentEditorConfig}
					onChange={(e) => handleEditorChange(e)}
				/>
				<Button type="submit" variant="dark " className="w-100 mt-1">
					Submit
				</Button>
			</Form>
		</div>
	);
};

export default CommentForm;
