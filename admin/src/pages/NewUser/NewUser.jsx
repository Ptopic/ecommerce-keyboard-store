import React, { useState, useEffect } from 'react';

// Styles
import './NewUser.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Button from '../../../../frontend/src/components/Button/Button';

import { toast, Toaster } from 'react-hot-toast';

import { Link } from 'react-router-dom';
import { admin_request } from '../../api';

function NewUser() {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const newUserSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		username: Yup.string().required('Username is required'),
		isAdmin: Yup.boolean().required('isAdmin is required'),
	});

	const initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		username: '',
		isAdmin: false,
	};

	const handleAddNewUser = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).post('/user/add', {
				...values,
			});
			console.log(res);
			toast.success('User added successfully');
			formikActions.resetForm();
			setIsLoading(false);
		} catch (error) {
			toast.error(error.response.data.error);
			setIsLoading(false);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	return (
		<div className="new-user">
			<Toaster />
			<h1>Add new User</h1>

			<div className="box">
				<Formik
					initialValues={initialValues}
					validationSchema={newUserSchema}
					onSubmit={(values, formikActions) =>
						handleAddNewUser(values, formikActions)
					}
				>
					{({ errors, touched }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<div className="input-container">
									<Field
										placeholder="First name *"
										name="firstName"
										autoCapitalize="off"
									/>
								</div>
								{errors.firstName && touched.firstName ? (
									<div className="error">{errors.firstName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Last name *"
										name="lastName"
										autoCapitalize="off"
									/>
								</div>
								{errors.lastName && touched.lastName ? (
									<div className="error">{errors.lastName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Username *"
										name="username"
										autoCapitalize="off"
									/>
								</div>
								{errors.username && touched.username ? (
									<div className="error">{errors.username}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Email *"
										type="email"
										name="email"
										autoCapitalize="off"
									/>
								</div>
								{errors.email && touched.email ? (
									<div className="error">{errors.email}</div>
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
								{errors.password && touched.password ? (
									<div className="error">{errors.password}</div>
								) : null}
								<div className="select-container">
									<Field placeholder="Role *" as="select" name="isAdmin">
										<option disabled selected>
											Select role
										</option>
										<option value={false}>User</option>
										<option value={true}>Admin</option>
									</Field>
								</div>
								{errors.isAdmin && touched.isAdmin ? (
									<div className="error">{errors.isAdmin}</div>
								) : null}
							</div>

							<div className="login-form-submit">
								<Button
									type="submit"
									isLoading={isLoading}
									width="100%"
									text="Add new User"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
			<Link to={'/users'} className='back-btn'>Back</Link>
		</div>
	);
}

export default NewUser;
