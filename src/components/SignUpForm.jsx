import { runInAction } from "mobx";
import React, { useContext, useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { StoreContext } from "../stores/RootStore";
import User from "../stores/UserStore";

const SignUpForm = ({ history }) => {
	const mobileView = window.matchMedia("(max-width: 767px)");

	const initialState = {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		confirmPassword: ""
	};

	const [newUser, setNewUser] = useState(initialState);

	const [error, setError] = useState(null);

	const { user } = useContext(StoreContext);

	const handleChange = ({ name, value }) => {
		setNewUser({ ...newUser, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const { data } = await User.signUp(
				first_name,
				last_name,
				email.toLowerCase(),
				password,
				confirmPassword
				
			);
			if (data) {
				runInAction(() => {
					user.id = data.id;
					user.first_name = data.first_name.charAt(0).toUpperCase() + first_name.slice(1);
					user.last_name = data.last_name.charAt(0).toUpperCase() + last_name.slice(1);
					user.email = data.email;
					user.role = data.role;
					user.isAuth = true;
					user.token = data.token;
				});
				history.push("/");
			}
		} catch (error) {
			console.log({ error });
			setError(error.response.data.message || error.message);
		}
	};

	const { first_name, last_name, email, password ,confirmPassword} = newUser;

	return (
		<Container className="register-page">
			<Row className="justify-content-center">
				<Col md={4}>
					{error && (
						<Alert className="mt-5" variant="danger">
							{error}
						</Alert>
					)}
					<h1 className="display-5 mt-5 mb-4 text-primary">Sign In</h1>
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="first_name">
							<Form.Label>First Name</Form.Label>
							<Form.Control
								size={mobileView && "sm"}
								name="first_name"
								value={first_name}
								type="text"
								onChange={(e) => handleChange(e.target)}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="last_name">
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								size={mobileView && "sm"}
								name="last_name"
								value={last_name}
								type="text"
								onChange={(e) => handleChange(e.target)}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								size={mobileView && "sm"}
								name="email"
								value={email}
								type="email"
								onChange={(e) => handleChange(e.target)}
							/>
							<Form.Text className="text-muted">
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								size={mobileView && "sm"}
								name="password"
								value={password}
								type="password"
								onChange={(e) => handleChange(e.target)}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="confirmPassword">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								size={mobileView && "sm"}
								name="confirmPassword"
								value={confirmPassword}
								type="password"
								onChange={(e) => handleChange(e.target)}
							/>
						</Form.Group>
						<Button
							className="w-100"
							variant="dark"
							type="submit"
							size={mobileView && "sm"}
						>
							Submit
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default SignUpForm;
