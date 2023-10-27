import React, { useState } from 'react';
import { login } from '../redux/apiCalls';
import { Link } from 'react-router-dom';
import { request } from '../api';

import { toast, Toaster } from 'react-hot-toast';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';

// Styles
import './Login.css';

function ForgotPassword() {
	const forgotPasswordSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
	});

	const initialValues = {
		email: '',
	};

	const handleForgotPassword = async (values, formikActions) => {
		try {
			const res = await request.post(`/auth/forgot-password`, {
				...values,
			});
			const data = res.data;
			if (data.success == true) {
				formikActions.resetForm();
				toast.success(data.message);
			}
		} catch (error) {
			formikActions.resetForm();
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	return (
		<>
			<Toaster />
			<Navbar />
			<div className="login-container">
				<div className="login-header">
					<p>Forgot password</p>
				</div>
				<Formik
					initialValues={initialValues}
					validationSchema={forgotPasswordSchema}
					onSubmit={(values, formikActions) =>
						handleForgotPassword(values, formikActions)
					}
				>
					{({ errors, touched }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<Field
									name="email"
									type="email"
									placeholder="Email"
									autoCapitalize="off"
								/>
								{errors.email && touched.email ? (
									<div className="error">{errors.email}</div>
								) : null}
							</div>
							<Link to="/login">Remembered your password? Login</Link>

							<div className="login-form-submit">
								<button type="submit" style={{ width: '300px' }}>
									Reset password
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
}

export default ForgotPassword;
