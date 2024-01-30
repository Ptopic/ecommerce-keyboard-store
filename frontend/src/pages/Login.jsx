import React, { useState } from 'react';
import { login } from '../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Styles
import './Login.css';

// Social login icons
import facebook from '../assets/socials/facebook.png';
import twitter from '../assets/socials/twitter.png';
import google from '../assets/socials/google.png';
import apple from '../assets/socials/apple.png';

import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField/InputField';

const Login = () => {
	const [passwordShow, setPasswordShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isFetching } = useSelector((state) => state.user);

	const loginSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
	});

	const initialValues = {
		email: '',
		password: '',
	};

	const handleLogin = async (values, formikActions) => {
		const res = await login(dispatch, { ...values });
		if (res.success == false) {
			toast.error(res.error);
		} else {
			formikActions.resetForm();
			// Redirect to main page
			navigate('/');
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	const handleFacebookLogin = () => {};
	const handleTwitterLogin = () => {};
	const handleGoogleLogin = () => {
		window.location.href = 'http://localhost:3001/api/auth/google';
	};
	const handleAppleLogin = () => {};
	return (
		<>
			<Toaster />
			<Navbar />
			<div className="login-container">
				<div className="login-header">
					<p>Login</p>
				</div>
				{/* <div className="social-logins-container">
					<button onClick={() => handleFacebookLogin()}>
						<img src={facebook} alt="" />
					</button>
					<button onClick={() => handleTwitterLogin()}>
						<img src={twitter} alt="" />
					</button>
					<button onClick={() => handleGoogleLogin()}>
						<img src={google} alt="" />
					</button>
					<button onClick={() => handleAppleLogin()}>
						<img src={apple} alt="" />
					</button>
				</div> */}
				<Formik
					initialValues={initialValues}
					validationSchema={loginSchema}
					onSubmit={(values, formikActions) =>
						handleLogin(values, formikActions)
					}
				>
					{({ errors, touched, setFieldValue }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<InputField
									type={'email'}
									name={'email'}
									placeholder={'Email *'}
									label={'Email'}
								/>
								{errors.email && touched.email ? (
									<div className="error">{errors.email}</div>
								) : null}
								<InputField
									name={'password'}
									placeholder={'Password *'}
									label={'Password'}
									passwordShow={passwordShow}
									togglePasswordShow={() => togglePasswordShow()}
								/>
								{errors.password && touched.password ? (
									<div className="error">{errors.password}</div>
								) : null}
							</div>
							<Link to="/forgot-password">Forgot your password?</Link>

							<div className="login-form-submit">
								<Button
									width="100%"
									text="Sign in"
									isLoading={isFetching}
									type="submit"
								/>
								<Link to={'/register'}>Create account</Link>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
};

export default Login;
