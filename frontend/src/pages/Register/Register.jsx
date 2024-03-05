import React, { useState } from 'react';
import { register } from '../../redux/apiCalls';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../../components/Navbar/Navbar';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

// Styles
import '../Login/Login.css';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Social login icons
import facebook from '../../assets/socials/facebook.png';
import twitter from '../../assets/socials/twitter.png';
import google from '../../assets/socials/google.png';
import apple from '../../assets/socials/apple.png';

import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';

import { useCookies } from 'react-cookie';

const Register = () => {
	const [cookies, setCookie] = useCookies();

	const dispatch = useDispatch();
	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const registerSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string()
			.min(5, 'Too Short!')
			.required('Password is required'),
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		username: Yup.string().required('Username is required'),
	});

	const initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		username: '',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: registerSchema,
		onSubmit: async (values, formikActions) => {
			handleRegister(values, formikActions);
		},
	});

	const handleRegister = async (values, formikActions) => {
		setIsLoading(true);
		const res = await register(dispatch, {
			...values,
		});
		setIsLoading(false);
		if (res.success == true) {
			// Set token cookie
			let token = res.token;
			setCookie('token', token, {
				expires: new Date(new Date().getTime() + 1440 * 60000),
				path: '/',
			});

			formikActions.resetForm();

			// Redirect to login page
			navigate('/user/registerThanks');
		} else {
			toast.error(res.error);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	const handleFacebookRegister = () => {};
	const handleTwitterRegister = () => {};
	const handleGoogleRegister = () => {};
	const handleAppleRegister = () => {};
	return (
		<>
			<Toaster />
			<Navbar />
			<div className="login-container">
				<div className="login-header">
					<p>Register</p>
				</div>
				{/* <div className="social-logins-container">
					<button onClick={() => handleFacebookRegister()}>
						<img src={facebook} alt="" />
					</button>
					<button onClick={() => handleTwitterRegister()}>
						<img src={twitter} alt="" />
					</button>
					<button onClick={() => handleGoogleRegister()}>
						<img src={google} alt="" />
					</button>
					<button onClick={() => handleAppleRegister()}>
						<img src={apple} alt="" />
					</button>
				</div> */}

				<FormikProvider value={formik}>
					<form className="login-form" onSubmit={formik.handleSubmit}>
						<div className="login-form-inputs">
							<InputField
								type={'text'}
								name={'firstName'}
								placeholder={'First Name *'}
								value={formik.values.firstName}
								onChange={(e) =>
									formik.setFieldValue('firstName', e.target.value)
								}
								onBlur={formik.handleBlur}
								errors={formik.errors.firstName}
								touched={formik.touched.firstName}
							/>
							<InputField
								type={'text'}
								name={'lastName'}
								placeholder={'Last Name *'}
								value={formik.values.lastName}
								onChange={(e) =>
									formik.setFieldValue('lastName', e.target.value)
								}
								onBlur={formik.handleBlur}
								errors={formik.errors.lastName}
								touched={formik.touched.lastName}
							/>
							<InputField
								type={'text'}
								name={'username'}
								placeholder={'Username *'}
								value={formik.values.username}
								onChange={(e) =>
									formik.setFieldValue('username', e.target.value)
								}
								onBlur={formik.handleBlur}
								errors={formik.errors.username}
								touched={formik.touched.username}
							/>
							<InputField
								type={'text'}
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

						<div className="login-form-submit">
							<Button
								type="submit"
								isLoading={isLoading}
								width="100%"
								text="Register"
							/>
							<Link to={'/login'}>Already have an account? Login</Link>
						</div>
					</form>
				</FormikProvider>
			</div>
		</>
	);
};

export default Register;
