import React, { useState, useEffect } from 'react';

// Styles
import './NewProduct.css';
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import { toast, Toaster } from 'react-hot-toast';

import { Link } from 'react-router-dom';
import { admin_request } from '../../api';

const NewProduct = () => {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	const [activeFields, setActiveFields] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	const newUserSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		description: Yup.string().required('Description is required'),
		images: Yup.string().required('Images is required'),
		category: Yup.string().required('Category is required'),
		details: Yup.string().required('Details is required'),
		price: Yup.number().required('Price is required'),
		stock: Yup.number().required('Stock is required'),
	});

	const initialValues = {
		title: '',
		description: '',
		images: '',
		category: 'Select category',
		details: '',
		price: 0,
		stock: 0,
	};

	const handleAddNewProduct = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).post('/products/add', {
				...values,
			});
			toast.success('Product added successfully');
			formikActions.resetForm();
			setIsLoading(false);
		} catch (error) {
			toast.error(error.response.data.error);
			setIsLoading(false);
		}
	};

	const getAllCategories = async () => {
		try {
			const res = await admin_request(userToken).get('/categories');
			setCategories(res.data.data);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	// Get all categories options
	useEffect(() => {
		getAllCategories();
	}, []);

	useEffect(() => {
		// Find selected category in category data
		let curCategory;
		categories.forEach((category) => {
			if (category['name'] == selectedCategory) {
				curCategory = category;
				console.log(category);
			}
		});
		// Set fieldDetails to category details
		if (curCategory != null) {
			setActiveFields(curCategory.fields);
		}

		// Display field details accordingly in ui to add data
	}, [selectedCategory]);

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Product</h1>

			<div className="box">
				<h2>Product Details:</h2>
				<div className="seperator-line"></div>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={newUserSchema}
					onSubmit={(values, formikActions) =>
						handleAddNewProduct(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div className="form-container">
								<InputField
									type={'text'}
									name={'title'}
									placeholder={'Title *'}
									value={values.title}
									onChange={(e) => setFieldValue('title', e.target.value)}
									errors={errors.title}
									touched={touched.title}
								/>
								<div className="row">
									<div>
										<InputField
											type={'number'}
											name={'price'}
											placeholder={'Price *'}
											value={values.price}
											onChange={(e) => setFieldValue('price', e.target.value)}
											errors={errors.price}
											touched={touched.price}
										/>
									</div>

									<div>
										<InputField
											type={'number'}
											name={'stock'}
											placeholder={'Stock *'}
											value={values.stock}
											onChange={(e) => setFieldValue('stock', e.target.value)}
											errors={errors.stock}
											touched={touched.stock}
										/>
									</div>
								</div>

								<div className="select-container">
									<p>Select category:</p>
									<Field
										placeholder="Category *"
										as="select"
										name="category"
										onChange={(e) => {
											setFieldValue('category', e.target.value);
											setSelectedCategory(e.target.value);
										}}
									>
										<option disabled>Select category</option>
										{categories.map((category) => {
											return (
												<option value={category.name}>{category.name}</option>
											);
										})}
									</Field>
								</div>
								{errors.category && touched.category ? (
									<div className="error">{errors.category}</div>
								) : null}
							</div>

							<div>
								<Button
									type="submit"
									isLoading={isLoading}
									width="100%"
									text="Add new Product"
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
			<Link to={'/products'} className="back-btn">
				Back
			</Link>
		</div>
	);
};

export default NewProduct;
