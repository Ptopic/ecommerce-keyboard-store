import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { login } from '../redux/apiCalls';
import { Link } from 'react-router-dom';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { request } from '../api';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';

import { toast, Toaster } from 'react-hot-toast';

// Styles
import './Login.css';

function ForgotPassword() {
	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigate();
	const [error, setError] = useState('');
	const { token, id } = queryString.parse(location.search);

	const passwordSchema = Yup.object().shape({
		password: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
	});

	const initialValues = {
		password: '',
	};

	const handleForgotPassword = async (values, formikActions) => {
		try {
			setIsLoading(true);
			const res = await request.post(
				`/auth/reset-password?tokenValue=${token}&id=${id}`,
				{ ...values }
			);
			const data = res.data;
			setIsLoading(false);
			if (data.success == true) {
				formikActions.resetForm();
				toast.success(data.message);
				// Navigate to login page
				navigation('/login');
			}
		} catch (error) {
			formikActions.resetForm();
			toast.error(error.response.data.error);
		}
	};

	const verifyToken = async () => {
		try {
			const res = await request.get(
				`/auth/verify-token?tokenValue=${token}&id=${id}`
			);
			const data = res.data;
			console.log(data.success);
			if (data.success == true) {
				setError(false);
			}
		} catch (error) {
			setError(error.response.data.error);
		}
	};

	useEffect(() => {
		verifyToken();
	}, []);

	if (error) {
		return (
			<>
				<Toaster />
				<Navbar />
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<h1>{error}</h1>
				</div>
			</>
		);
	}

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	return (
		<>
			<Toaster />
			<Navbar />
			<div className="login-container">
				<div className="login-header">
					<p>Reset password</p>
				</div>
				<Formik
					initialValues={initialValues}
					validationSchema={passwordSchema}
					onSubmit={(values, formikActions) =>
						handleForgotPassword(values, formikActions)
					}
				>
					{({ errors, touched }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
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
							</div>
							<Link to="/login">Remembered your password? Login</Link>

							<div className="login-form-submit">
								<Button
									text="Reset password"
									type="submit"
									isLoading={isLoading}
									width="100%"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
}

export default ForgotPassword;
