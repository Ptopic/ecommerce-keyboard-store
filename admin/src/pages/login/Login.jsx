import React, { useState } from 'react';
import { login } from '../../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Button from '../../components/Button/Button';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Styles
import './Login.css';

// Social login icons
// import facebook from '../assets/socials/facebook.png';
// import twitter from '../assets/socials/twitter.png';
// import google from '../assets/socials/google.png';
// import apple from '../assets/socials/apple.png';

import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

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
		console.log(res);
		console.log(res.data);
		if (res.success == true && res.isAdmin == true) {
			formikActions.resetForm();
			// Redirect to main page
			navigate('/');
		} else if (res.success == false) {
			toast.error(res.error);
		} else {
			toast.error('User is not an Admin, Try another user.');
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
					{({ errors, touched }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<div className="input-container">
									<Field
										name="email"
										placeholder="Email *"
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
							</div>

							<div className="login-form-submit">
								<Button
									width="100%"
									text="Sign in"
									isLoading={isFetching}
									type="submit"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
};

export default Login;
