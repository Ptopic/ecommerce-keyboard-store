import React, { useState, useEffect } from 'react';

// Styles
import './EditCategory.css';

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

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { admin_request } from '../../api';

function EditCategory() {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [categoryData, setCategoryData] = useState(null);

	const newCategorySchema = Yup.object().shape({
		name: Yup.string().required('Category name is required'),
	});

	const initialValues = {
		name: categoryData?.name,
	};

	const fetchCategoryById = async () => {
		try {
			const res = await admin_request(userToken).get('/categories/' + id);
			setCategoryData(res.data.data);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	const handleEditCategory = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).put('/categories/' + id, {
				...values,
			});
			formikActions.resetForm();
			setIsLoading(false);
			navigate('/categories');
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.error);
			setIsLoading(false);
		}
	};

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow);
	};

	// Fetch category by id on page load
	useEffect(() => {
		fetchCategoryById();
	}, []);

	return (
		<div className="edit-category">
			<Toaster />
			<h1>Edit Category</h1>

			<div className="box">
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={newCategorySchema}
					onSubmit={(values, formikActions) =>
						handleEditCategory(values, formikActions)
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
									text="Edit User"
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

export default EditCategory;
