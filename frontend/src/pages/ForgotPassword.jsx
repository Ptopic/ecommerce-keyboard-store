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
import Button from '../components/Button/Button';

// Styles
import './Login.css';
import InputField from '../components/InputField/InputField';

function ForgotPassword() {
	const [isLoading, setIsLoading] = useState(false);
	const forgotPasswordSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
	});

	const initialValues = {
		email: '',
	};

	const handleForgotPassword = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await request.post(`/auth/forgot-password`, {
				...values,
			});
			const data = res.data;
			setIsLoading(false);
			if (data.success == true) {
				formikActions.resetForm();
				toast.success(data.message);
			}
		} catch (error) {
			setIsLoading(false);
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
					{({ values, errors, touched, setFieldValue }) => (
						<Form className="login-form">
							<div className="login-form-inputs">
								<InputField
									type={'email'}
									name={'email'}
									placeholder={'Email *'}
									value={values.email}
									onChange={(e) => setFieldValue('email', e.target.value)}
									errors={errors.email}
									touched={touched.email}
								/>
							</div>
							<Link to="/login">Remembered your password? Login</Link>

							<div className="login-form-submit">
								<Button
									type="submit"
									text="Reset password"
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
