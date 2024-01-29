import React, { useState, useEffect } from 'react';

import './UserChangePassword.css';
import './UserDetails.css';
import '../pages/Checkout.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Redux
import { useSelector } from 'react-redux';

// Components
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';
import { userRequest } from '../api';

import { toast, Toaster } from 'react-hot-toast';

function UserChangePassword() {
	const user = useSelector((state) => state.user.currentUser);
	const [passwordShow, setPasswordShow] = useState(false);
	const [newPasswordShow, setNewPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const passwordSchema = Yup.object().shape({
		currentPassword: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
		newPassword: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
	});

	const initialValues = {
		currentPassword: '',
		newPassword: '',
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	const toggleNewPasswordShow = () => {
		setNewPasswordShow(!newPasswordShow);
	};

	const handleChangePassword = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await userRequest.put('/user/changePassword', {
				userId: user.data._id,
				...values,
			});
			toast.success('Your password was succesfully changed!');
			formikActions.resetForm();
		} catch (error) {
			toast.error(error.response.data.error);
		}

		setIsLoading(false);
	};

	return (
		<div className="user-password">
			<Toaster />
			<Navbar />

			<div className="user-password-container">
				<div className="user-sidebar">
					<Link to={'/user/details'}>Korisnički podaci</Link>

					<Link to={'/user/orders'}>Pregled narudžbi</Link>

					<Link className="active" to={'/user/changePassword'}>
						Promjena lozinke
					</Link>
				</div>

				<div className="user-password-content">
					<h1>Promjena lozinke</h1>

					<Formik
						initialValues={initialValues}
						validationSchema={passwordSchema}
						onSubmit={(values, formikActions) =>
							handleChangePassword(values, formikActions)
						}
					>
						{({ errors, touched }) => (
							<Form className="login-form" style={{ width: '100%' }}>
								<div className="login-form-inputs">
									<div className="input-container">
										<Field
											name="currentPassword"
											placeholder="Current Password *"
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
									{errors.currentPassword && touched.currentPassword ? (
										<div className="error">{errors.currentPassword}</div>
									) : null}

									<div className="input-container">
										<Field
											name="newPassword"
											placeholder="New Password *"
											type={newPasswordShow ? 'text' : 'password'}
											autoCapitalize="off"
										/>
										<button
											type="button"
											onClick={() => toggleNewPasswordShow()}
										>
											{newPasswordShow ? (
												<FaRegEyeSlash size={24} />
											) : (
												<FaRegEye size={24} />
											)}
										</button>
									</div>
									{errors.newPassword && touched.newPassword ? (
										<div className="error">{errors.newPassword}</div>
									) : null}
								</div>

								{error ? <div className="error">{error}</div> : null}

								<div className="reset-form-submit">
									<Button
										text="Reset password"
										type="submit"
										isLoading={isLoading}
										width="30%"
									/>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
}

export default UserChangePassword;
