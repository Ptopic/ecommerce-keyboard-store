import React, { useState } from 'react';
import { register } from '../redux/apiCalls';
import { Link } from 'react-router-dom';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
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

const Register = () => {
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
		const res = await register({
			...values,
		});
		setIsLoading(false);
		if (res.success == false) {
			toast.error(res.error);
		} else {
			formikActions.resetForm();
			// Redirect to login page
			navigate('/login');
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
					{({ errors, touched }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<div className="input-container">
									<Field
										placeholder="First name *"
										name="firstName"
										autoCapitalize="off"
									/>
								</div>
								{errors.firstName && touched.firstName ? (
									<div className="error">{errors.firstName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Last name *"
										name="lastName"
										autoCapitalize="off"
									/>
								</div>
								{errors.lastName && touched.lastName ? (
									<div className="error">{errors.lastName}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Username *"
										name="username"
										autoCapitalize="off"
									/>
								</div>
								{errors.username && touched.username ? (
									<div className="error">{errors.username}</div>
								) : null}
								<div className="input-container">
									<Field
										placeholder="Email *"
										type="email"
										name="email"
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
