import React, { useState, useEffect } from 'react';

// Styles
import './NewCategory.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import { toast, Toaster } from 'react-hot-toast';

import { Link } from 'react-router-dom';
import { admin_request } from '../../api';

function NewCategory() {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const newCategorySchema = Yup.object().shape({
		name: Yup.string().required('Category name is required'),
	});

	const initialValues = {
		name: '',
	};

	const handleAddNewCategory = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).post('/categories', {
				...values,
			});
			console.log(res);
			toast.success('Category added successfully');
			formikActions.resetForm();
			setIsLoading(false);
		} catch (error) {
			toast.error(error.response.data.error);
			setIsLoading(false);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	return (
		<div className="new-category">
			<Toaster />
			<h1>Add new Category</h1>

			<div className="box">
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={newCategorySchema}
					onSubmit={(values, formikActions) =>
						handleAddNewCategory(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div>
								<InputField
									type={'text'}
									name={'name'}
									placeholder={'Category Name *'}
									value={values.name}
									onChange={(e) => setFieldValue('name', e.target.value)}
									errors={errors.name}
									touched={touched.name}
								/>
							</div>

							<div className="login-form-submit">
								<Button
									type="submit"
									isLoading={isLoading}
									width="100%"
									text="Add new Category"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
			<Link to={'/categories'} className="back-btn">
				Back
			</Link>
		</div>
	);
}

export default NewCategory;
