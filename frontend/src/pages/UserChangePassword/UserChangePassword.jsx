import React, { useState, useEffect } from 'react';

import './UserChangePassword.css';
import '../UserDetails/UserDetails.css';
import '../Checkout/Checkout.css';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Redux
import { useSelector } from 'react-redux';

// Components
import Navbar from '../../components/Navbar/Navbar';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import { Link } from 'react-router-dom';
import { user_request, userRequest } from '../../api';

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
			.required('Current Password is required'),
		newPassword: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
	});

	const initialValues = {
		currentPassword: '',
		newPassword: '',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: passwordSchema,
		onSubmit: async (values, formikActions) => {
			handleChangePassword(values, formikActions);
		},
	});

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	const toggleNewPasswordShow = () => {
		setNewPasswordShow(!newPasswordShow);
	};

	const handleChangePassword = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await user_request(user.token).put('/user/changePassword', {
				userId: user._id,
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
					<FormikProvider value={formik}>
						<form
							className="login-form"
							style={{ width: '100%' }}
							onSubmit={formik.handleSubmit}
						>
							<div className="login-form-inputs">
								<InputField
									name={'currentPassword'}
									placeholder={'Current Password *'}
									passwordShow={passwordShow}
									togglePasswordShow={() => togglePasswordShow()}
									value={formik.values.currentPassword}
									onChange={(e) =>
										formik.setFieldValue('currentPassword', e.target.value)
									}
									onBlur={formik.handleBlur}
									errors={formik.errors.currentPassword}
									touched={formik.touched.currentPassword}
								/>

								<InputField
									name={'newPassword'}
									placeholder={'New Password *'}
									passwordShow={newPasswordShow}
									togglePasswordShow={() => toggleNewPasswordShow()}
									value={formik.values.newPassword}
									onChange={(e) =>
										formik.setFieldValue('newPassword', e.target.value)
									}
									onBlur={formik.handleBlur}
									errors={formik.errors.newPassword}
									touched={formik.touched.newPassword}
								/>
							</div>

							{error ? <div className="error">{error}</div> : null}

							<div className="reset-form-submit">
								<Button
									text="Reset password"
									type="submit"
									isLoading={isLoading}
								/>
							</div>
						</form>
					</FormikProvider>
				</div>
			</div>
		</div>
	);
}

export default UserChangePassword;
