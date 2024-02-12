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

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { toast, Toaster } from 'react-hot-toast';

import { Link } from 'react-router-dom';
import { admin_request } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';

const NewProduct = () => {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [details, setDetails] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');

	const [files, setFiles] = useState([]);

	const [activeFields, setActiveFields] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image'],
			['clean'],
		],
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
	];

	const newUserSchema = Yup.object().shape({
		title: Yup.string(),
		category: Yup.string(),
		price: Yup.number(),
		stock: Yup.number(),
	});

	const initialValues =
		activeFields.length > 0
			? {
					title: title,
					description: description,
					category: selectedCategory,
					details: details,
					price: price,
					stock: stock,
					...activeFields,
			  }
			: {
					title: title,
					description: '',
					category:
						selectedCategory != '' ? selectedCategory : 'Select category',
					price: price,
					stock: stock,
			  };

	const handleAddNewProduct = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).post('/products', {
				...values,
				images: files,
			});
			console.log(res);
			toast.success('Product added successfully');
			formikActions.resetForm();
			setIsLoading(false);
		} catch (error) {
			toast.error('Something went wrong');
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

	const dragAndDropOnChange = (e) => {
		setFieldValue('files', e.target.files[0]);
	};

	useEffect(() => {
		// Find selected category in category data
		let curCategory;
		categories.forEach((category) => {
			if (category['name'] == selectedCategory) {
				curCategory = category;
			}
		});
		// Set fieldDetails to category details
		if (curCategory != null) {
			// Format active fields
			const namesOfActiveFields = curCategory.fields.map((field) => field.name);
			setActiveFields(namesOfActiveFields);
		}
	}, [selectedCategory]);

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Product</h1>

			<div className="box">
				<h2>Product Information:</h2>
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
									onChange={(e) => {
										setTitle(e.target.value);
										setFieldValue('title', e.target.value);
									}}
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
											onChange={(e) => {
												setPrice(e.target.value);
												setFieldValue('price', e.target.value);
											}}
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
											onChange={(e) => {
												setStock(e.target.value);
												setFieldValue('stock', e.target.value);
											}}
											errors={errors.stock}
											touched={touched.stock}
										/>
									</div>
								</div>

								<div className="description-container">
									<p>Description</p>
									<ReactQuill
										name="description"
										theme="snow"
										modules={modules}
										formats={formats}
										value={description || ''}
										onChange={(newValue) => {
											setDescription(newValue);
											setFieldValue('description', newValue);
										}}
									/>
								</div>

								<div className="file-container">
									<p>File</p>
									<DragAndDrop
										onChange={dragAndDropOnChange}
										setFiles={setFiles}
									/>
								</div>

								<div className="select-container">
									<p>Select category</p>
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
										{categories.map((category, id) => {
											return (
												<option value={category.name} key={id}>
													{category.name}
												</option>
											);
										})}
									</Field>
								</div>
								{errors.category && touched.category ? (
									<div className="error">{errors.category}</div>
								) : null}
							</div>

							{activeFields.length > 0 && (
								<div className="product-details">
									<div className="additional-info">
										<h2>Product Details:</h2>
										<div className="seperator-line"></div>
									</div>

									{activeFields.map((el) => {
										return (
											<InputField
												type={'text'}
												name={el}
												placeholder={el + ' *'}
												value={values.el}
												onChange={(e) => setFieldValue(el, e.target.value)}
												errors={errors.el}
												touched={touched.el}
											/>
										);
									})}
								</div>
							)}

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
