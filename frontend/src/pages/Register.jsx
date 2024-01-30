import React, { useState } from 'react';
import { register } from '../redux/apiCalls';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';

// Styles
import './Login.css';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Social login icons
import facebook from '../assets/socials/facebook.png';
import twitter from '../assets/socials/twitter.png';
import google from '../assets/socials/google.png';
import apple from '../assets/socials/apple.png';

import { toast, Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';

const Register = () => {
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

	const handleRegister = async (values, formikActions) => {
		setIsLoading(true);
		const res = await register(dispatch, {
			...values,
		});
		setIsLoading(false);
		if (res.success == false) {
			toast.error(res.error);
		} else {
			formikActions.resetForm();

			// Redirect to login page
			navigate('/user/registerThanks');
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
				<Formik
					initialValues={initialValues}
					validationSchema={registerSchema}
					onSubmit={(values, formikActions) =>
						handleRegister(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
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
									type={'text'}
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
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
};

export default Register;
