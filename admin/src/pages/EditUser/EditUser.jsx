import React, { useState, useEffect } from 'react';

// Styles
import './EditUser.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Button from '../../../../frontend/src/components/Button/Button';

import { toast, Toaster } from 'react-hot-toast';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { admin_request } from '../../api';

function EditUser() {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [userData, setUserData] = useState(null);

	const editUserSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string().min(5, 'Too Short!'),
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		username: Yup.string().required('Username is required'),
		isAdmin: Yup.boolean().required('isAdmin is required'),
	});

	let initialValues = {
		email: userData?.email,
		password: '',
		firstName: userData?.firstName,
		lastName: userData?.lastName,
		username: userData?.username,
		isAdmin: userData?.isAdmin,
	};

	const fetchUserById = async () => {
		try {
			const res = await admin_request(userToken).get('/user/' + id);
			setUserData(res.data.data);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	const handleEditUser = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).put('/user/edit/' + id, {
				...values,
			});
			console.log(res);
			// toast.success('User added successfully');
			formikActions.resetForm();
			setIsLoading(false);
			navigate('/users');
		} catch (error) {
			console.log(error);
			// toast.error(error.response.data.error);
			setIsLoading(false);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	// Fetch user by id on page load
	useEffect(() => {
		fetchUserById();
	}, []);

	return (
		<div className="edit-user">
			<Toaster />
			<h1>Edit User</h1>

			<div className="box">
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={editUserSchema}
					onSubmit={(values, formikActions) =>
						handleEditUser(values, formikActions)
					}
				>
					{(formik) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<div className="input-container">
									<Field
										placeholder="First name *"
										name="firstName"
										autoCapitalize="off"
										value={formik.values.firstName}
									/>
								</div>
								{formik.errors.firstName && formik.touched.firstName ? (
									<div className="error">{formik.errors.firstName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Last name *"
										name="lastName"
										autoCapitalize="off"
										value={formik.values.lastName}
									/>
								</div>
								{formik.errors.lastName && formik.touched.lastName ? (
									<div className="error">{formik.errors.lastName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Username *"
										name="username"
										autoCapitalize="off"
										value={formik.values.username}
									/>
								</div>
								{formik.errors.username && formik.touched.username ? (
									<div className="error">{formik.errors.username}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Email *"
										type="email"
										name="email"
										autoCapitalize="off"
										value={formik.values.email}
									/>
								</div>
								{formik.errors.email && formik.touched.email ? (
									<div className="error">{formik.errors.email}</div>
								) : null}
								<div className="input-container">
									<Field
										name="password"
										placeholder="Password *"
										type={passwordShow ? 'text' : 'password'}
										autoCapitalize="off"
									/>
									<button type="button" onClick={() => togglePasswordShow()}>
										{passwordShow ? (
											<FaRegEyeSlash size={24} />
										) : (
											<FaRegEye size={24} />
										)}
									</button>
								</div>
								{formik.errors.password && formik.touched.password ? (
									<div className="error">{formik.errors.password}</div>
								) : null}
								<div className="select-container">
									<Field
										placeholder="Role *"
										as="select"
										name="isAdmin"
										value={formik.values.isAdmin}
									>
										<option disabled selected>
											Select role
										</option>
										<option value={false}>User</option>
										<option value={true}>Admin</option>
									</Field>
								</div>
								{formik.errors.isAdmin && formik.touched.isAdmin ? (
									<div className="error">{formik.errors.isAdmin}</div>
								) : null}
							</div>

							<div className="login-form-submit">
								<Button
									type="submit"
									isLoading={isLoading}
									width="100%"
									text="Edit User"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
			<Link to={'/users'} className="back-btn">
				Back
			</Link>
		</div>
	);
}

export default EditUser;
