import React, { useState } from 'react';
import { login } from '../../redux/apiCalls';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure } from '../../redux/userRedux';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/Button/Button';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Styles
import './Login.css';

// Social login icons
import facebook from '../../assets/socials/facebook.png';
import twitter from '../../assets/socials/twitter.png';
import google from '../../assets/socials/google.png';
import apple from '../../assets/socials/apple.png';

import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';

import { useCookies } from 'react-cookie';

const Login = () => {
	const [cookies, setCookie] = useCookies();

	const [passwordShow, setPasswordShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isFetching } = useSelector((state) => state.user);

	const loginSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string().required('Password is required'),
	});

	const initialValues = {
		email: '',
		password: '',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: loginSchema,
		onSubmit: async (values, formikActions) => {
			handleLogin(values, formikActions);
		},
	});

	const handleLogin = async (values, formikActions) => {
		const res = await login(dispatch, { ...values });

		if (res.success == true) {
			// Set token cookie
			let token = res.token;
			const cookiePromise = setCookie('token', token, {
				expires: new Date(new Date().getTime() + 1440 * 60000),
				path: '/',
			});

			formikActions.resetForm();
			Promise.all([cookiePromise]).then(() => {
				window.location.href = '/';
			});
		} else {
			toast.error(res.error);

			dispatch(loginFailure());
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
				<FormikProvider value={formik}>
					<form className="login-form" onSubmit={formik.handleSubmit}>
						<div className="login-form-inputs">
							<InputField
								type={'email'}
								name={'email'}
								placeholder={'Email *'}
								value={formik.values.email}
								onChange={(e) => formik.setFieldValue('email', e.target.value)}
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
								onChange={(e) =>
									formik.setFieldValue('password', e.target.value)
								}
								onBlur={formik.handleBlur}
								errors={formik.errors.password}
								touched={formik.touched.password}
							/>
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
					</form>
				</FormikProvider>
			</div>
		</>
	);
};

export default Login;
