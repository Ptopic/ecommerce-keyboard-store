import React, { useState, useEffect } from 'react';

// Styles
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import { toast, Toaster } from 'react-hot-toast';

import { Link } from 'react-router-dom';
import { admin_request, userRequest } from '../../api';

import { useSearchParams } from 'react-router-dom';

function NewUser() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

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
		isAdmin: Yup.boolean()
			.required('isAdmin is required')
			.notOneOf(['Select role'], 'Please select a role'),
	});

	const initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		username: '',
		isAdmin: 'Select role',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: newUserSchema,
		onSubmit: async (values, formikActions) => {
			handleAddNewUser(values, formikActions);
		},
	});

	const handleAddNewUser = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await userRequest.post('/user/add', {
				...values,
			});
			toast.success('User added successfully');
			formikActions.resetForm();
			setIsLoading(false);
		} catch (error) {
			toast.error(
				error.response.data.error
					? error.response.data.error
					: 'Something went wrong'
			);
			setIsLoading(false);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	return (
		<div className="form">
			<Toaster />
			<h1>Add new User</h1>

			<div className="box">
				<h2>User Details:</h2>
				<div className="seperator-line"></div>

				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit}>
						<div className="form-container">
							<div className="row">
								<div>
									<InputField
										type={'text'}
										name={'firstName'}
										placeholder={'First Name *'}
										value={formik.values.firstName}
										onChange={(e) => {
											formik.setFieldValue('firstName', e.target.value);
										}}
										onBlur={formik.handleBlur}
										errors={formik.errors.firstName}
										touched={formik.touched.firstName}
									/>
								</div>

								<div>
									<InputField
										type={'text'}
										name={'lastName'}
										placeholder={'Last Name *'}
										value={formik.values.lastName}
										onChange={(e) => {
											formik.setFieldValue('lastName', e.target.value);
										}}
										onBlur={formik.handleBlur}
										errors={formik.errors.lastName}
										touched={formik.touched.lastName}
									/>
								</div>
							</div>

							<InputField
								type={'text'}
								name={'username'}
								placeholder={'Username *'}
								value={formik.values.username}
								onChange={(e) => {
									formik.setFieldValue('username', e.target.value);
								}}
								onBlur={formik.handleBlur}
								errors={formik.errors.username}
								touched={formik.touched.username}
							/>

							<InputField
								type={'email'}
								name={'email'}
								placeholder={'Email *'}
								value={formik.values.email}
								onChange={(e) => {
									formik.setFieldValue('email', e.target.value);
								}}
								onBlur={formik.handleBlur}
								errors={formik.errors.email}
								touched={formik.touched.email}
							/>

							<InputField
								name={'password'}
								placeholder={'Password *'}
								passwordShow={passwordShow}
								togglePasswordShow={() => togglePasswordShow()}
								value={formik.values.password}
								onChange={(e) => {
									formik.setFieldValue('password', e.target.value);
								}}
								onBlur={formik.handleBlur}
								errors={formik.errors.password}
								touched={formik.touched.password}
							/>

							<div className="select-container">
								<p>Select role:</p>
								<select
									placeholder="Role *"
									as="select"
									name="isAdmin"
									value={formik.values.isAdmin}
									onChange={(e) => {
										formik.setFieldValue('isAdmin', e.target.value);
									}}
									onBlur={formik.handleBlur}
								>
									<option disabled>Select role</option>
									<option value={false}>User</option>
									<option value={true}>Admin</option>
								</select>
							</div>
							{formik.errors.isAdmin && formik.touched.isAdmin ? (
								<div className="error">{formik.errors.isAdmin}</div>
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
					</form>
				</FormikProvider>
			</div>
			<Link
				to={`/users?page=${page}&pageSize=${pageSize}${
					sort != null ? '&sort=' + sort : ''
				}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}
`}
				className="back-btn"
				reloadDocument
			>
				Back
			</Link>
		</div>
	);
}

export default NewUser;
