import React, { useState, useEffect } from 'react';

// Styles
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

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
			toast.error(error.response.data.error);
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
		<div className="form">
			<Toaster />
			<h1>Edit User</h1>

			<div className="box">
				<h2>User Details:</h2>
				<div className="seperator-line"></div>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={editUserSchema}
					onSubmit={(values, formikActions) =>
						handleEditUser(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div className="form-container">
								<div className="row">
									<div>
										<InputField
											type={'text'}
											name={'firstName'}
											placeholder={'First Name *'}
											value={values.firstName}
											onChange={(e) =>
												setFieldValue('firstName', e.target.value)
											}
											errors={errors.firstName}
											touched={touched.firstName}
										/>
									</div>

									<div>
										<InputField
											type={'text'}
											name={'lastName'}
											placeholder={'Last Name *'}
											value={values.lastName}
											onChange={(e) =>
												setFieldValue('lastName', e.target.value)
											}
											errors={errors.lastName}
											touched={touched.lastName}
										/>
									</div>
								</div>

								<InputField
									type={'text'}
									name={'username'}
									placeholder={'Username *'}
									value={values.username}
									onChange={(e) => setFieldValue('username', e.target.value)}
									errors={errors.username}
									touched={touched.username}
								/>

								<InputField
									type={'email'}
									name={'email'}
									placeholder={'Email *'}
									value={values.email}
									onChange={(e) => setFieldValue('email', e.target.value)}
									errors={errors.email}
									touched={touched.email}
								/>

								<InputField
									name={'password'}
									placeholder={'Password'}
									passwordShow={passwordShow}
									togglePasswordShow={() => togglePasswordShow()}
									value={values.password}
									onChange={(e) => setFieldValue('password', e.target.value)}
									errors={errors.password}
									touched={touched.password}
									required={false}
								/>

								<div className="select-container">
									<p>Select role:</p>
									<Field placeholder="Role *" as="select" name="isAdmin">
										<option disabled>Select role</option>
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
