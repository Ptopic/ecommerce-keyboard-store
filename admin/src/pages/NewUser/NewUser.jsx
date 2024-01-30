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
import InputField from '../../../../frontend/src/components/InputField/InputField';

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
					enableReinitialize
					initialValues={initialValues}
					validationSchema={newUserSchema}
					onSubmit={(values, formikActions) =>
						handleAddNewUser(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div>
								<InputField
									type={'text'}
									name={'firstName'}
									placeholder={'First Name *'}
									value={values.firstName}
									onChange={(e) => setFieldValue('firstName', e.target.value)}
									errors={errors.firstName}
									touched={touched.firstName}
								/>

								<InputField
									type={'text'}
									name={'lastName'}
									placeholder={'Last Name *'}
									value={values.lastName}
									onChange={(e) => setFieldValue('lastName', e.target.value)}
									errors={errors.lastName}
									touched={touched.lastName}
								/>

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
									placeholder={'Password *'}
									passwordShow={passwordShow}
									togglePasswordShow={() => togglePasswordShow()}
									value={values.password}
									onChange={(e) => setFieldValue('password', e.target.value)}
									errors={errors.password}
									touched={touched.password}
								/>

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

							<div>
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
			<Link to={'/users'} className="back-btn">
				Back
			</Link>
		</div>
	);
}

export default NewUser;
