import React, { useState, useEffect } from 'react';

// Styles
import './EditProduct.css';
import '../NewProduct/NewProduct.css';
import '../../styles/forms.css';

// Icons
import { IoClose } from 'react-icons/io5';

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

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { admin_request } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';
import Spinner from '../../components/Spinner/Spinner';

const EditProduct = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const [product, setProduct] = useState([]);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	const [activeFields, setActiveFields] = useState([]);
	const [activeFieldsValues, setActiveFieldsValues] = useState({});

	const [specifications, setSpecifications] = useState('');
	const [description, setDescription] = useState('');

	const [files, setFiles] = useState([]);
	const [previousFiles, setPreviousFiles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [imageRemoveIsLoading, setImageRemoveIsLoading] = useState(false);

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

	const resetAllFormData = () => {
		setSpecifications('');
		setDescription('');
		setFiles([]);
		setActiveFields([]);
	};

	const handleEditProduct = async (values, formikActions) => {
		console.log(values);
		if (files?.length != 0) {
			console.log(values);

			setIsLoading(true);
			try {
				const res = await admin_request(userToken).put('/products/' + id, {
					...values,
					images: files,
					activeFields: activeFields,
				});

				console.log(files);
				console.log(res);
				toast.success('Product added successfully');
				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
				navigate(0);
			} catch (error) {
				toast.error('Something went wrong');
				setIsLoading(false);
			}
		} else {
			console.log(values);

			setIsLoading(true);
			try {
				const res = await admin_request(userToken).put('/products/' + id, {
					...values,
					activeFields: activeFields,
				});

				console.log(files);
				console.log(res);
				toast.success('Product added successfully');
				formikActions.resetForm();
				setIsLoading(false);
				navigate('/products');
			} catch (error) {
				toast.error('Something went wrong');
				setIsLoading(false);
			}
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

	const mapActiveFieldsFromSelectedCategory = () => {
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

			let object = {};
			let validationObject = {};

			// Map names of active fields as object
			for (let i = 0; i < namesOfActiveFields.length; i++) {
				object[namesOfActiveFields[i]] = '';
				validationObject[namesOfActiveFields[i]] = Yup.string().notRequired();
			}

			setActiveFields(namesOfActiveFields);
			return namesOfActiveFields;
		}
	};

	const getProduct = async () => {
		try {
			await admin_request(userToken)
				.get('/products/find/' + id)
				.then((res) => {
					let productData = res.data.data;

					setSelectedCategory(productData?.category);

					setSpecifications(productData?.specifications);
					setDescription(productData?.description);

					setProduct(productData);

					setPreviousFiles(productData.images);
				});
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	// Get all categories options
	useEffect(() => {
		getAllCategories();
		getProduct();
	}, []);

	useEffect(() => {
		if (categories.length === 0) {
			getAllCategories();
		} else {
			mapActiveFieldsFromSelectedCategory(product);
		}
	}, [categories]);

	useEffect(() => {
		mapActiveFieldsFromSelectedCategory(product);
	}, [selectedCategory]);

	const dragAndDropOnChange = (e) => {
		setFieldValue('files', e.target.files[0]);
	};

	const getActiveFieldsValidationSchema = () => {
		let schema = {};
		activeFields.forEach((field) => {
			schema[field] = Yup.string().required(`${field} is required`);
		});
		return schema;
	};

	const newProductSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		description: Yup.string(),
		category: Yup.string()
			.required('Category is required')
			.notOneOf(['Select category'], 'Please select a category'),
		price: Yup.number().required('Price is required'),
		stock: Yup.number().required('Stock is required'),
		files: Yup.array(),
		...getActiveFieldsValidationSchema(), // Add validation schema for active fields
	});

	const getInitialValuesForActiveFields = (product) => {
		let initialValues = {};
		let productDetails = product.details;
		activeFields.forEach((field) => {
			if (product && productDetails && productDetails[field]) {
				initialValues[field] = productDetails[field];
			} else {
				initialValues[field] = '';
			}
		});
		return initialValues;
	};

	const initialValues = {
		title: product ? product.title : '',
		description: product ? product.description : '',
		specifications: product ? product.specifications : '',
		category: product ? product.category : 'Select category',
		price: product ? product.price : '',
		stock: product ? product.stock : '',
		files: [],
		...getInitialValuesForActiveFields(product),
	};

	const removePreviousImage = async (e, productImageId) => {
		console.log(productImageId);

		setImageRemoveIsLoading(true);

		try {
			await admin_request(userToken)
				.delete('/products/image/' + id, {
					data: { productImageId: productImageId },
				})
				.then((res) => {
					console.log(res);
					navigate(0);
				});
		} catch (error) {
			toast.error('Something went wrong');
		}

		setImageRemoveIsLoading(false);
	};

	return (
		<div className="form">
			<Toaster />
			<h1>Edit Product</h1>

			<div className="box">
				<h2>Product Information:</h2>
				<div className="seperator-line"></div>
				<Formik
					enableReinitialize={true}
					initialValues={initialValues}
					validationSchema={newProductSchema}
					onSubmit={(values, formikActions) => {
						console.log(values);
						handleEditProduct(values, formikActions);
					}}
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
										setFieldValue('title', e.target.value);
									}}
									errors={errors.title}
									touched={touched.title}
								/>
								<div className="row">
									<div>
										<InputField
											type={'text'}
											name={'price'}
											placeholder={'Price *'}
											value={values.price}
											onChange={(e) => {
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
												setFieldValue('stock', e.target.value);
											}}
											errors={errors.stock}
											touched={touched.stock}
										/>
									</div>
								</div>

								<div className="description-container">
									<p>Specifications</p>
									<ReactQuill
										name="specifications"
										theme="snow"
										modules={modules}
										formats={formats}
										value={specifications}
										onChange={(newValue) => {
											setSpecifications(newValue);
											setFieldValue('specifications', newValue);
										}}
									/>
								</div>

								<div className="description-container">
									<p>Description</p>
									<ReactQuill
										name="description"
										theme="snow"
										modules={modules}
										formats={formats}
										value={description}
										onChange={(newValue) => {
											setDescription(newValue);
											setFieldValue('description', newValue);
										}}
									/>
								</div>

								<div className="file-container">
									<p>Files</p>
									<DragAndDrop
										onChange={dragAndDropOnChange}
										setFiles={setFiles}
										currentImages={files}
									/>
								</div>

								<div className="file-container">
									<p>Current Files</p>
									<div className="previous-images-container">
										{previousFiles.map((prevFile, id) => {
											return (
												<div className="uploaded-image" key={id}>
													<button
														type="button"
														className="close-img-btn"
														onClick={(e) => removePreviousImage(e, id)}
													>
														{imageRemoveIsLoading === true ? (
															<Spinner
																width={22}
																height={22}
																borderWidth={2}
																color={'#a94442'}
															/>
														) : (
															<IoClose />
														)}
													</button>
													<img src={prevFile.url} alt="uploaded image" />
												</div>
											);
										})}
									</div>
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
										<h2>Product Details (Optional):</h2>
										<div className="seperator-line"></div>
									</div>

									{activeFields.map((field, index) => (
										<InputField
											key={index}
											type="text"
											name={field}
											placeholder={field}
											value={values[field]}
											onChange={(e) => {
												{
													setFieldValue(field, e.target.value);
												}
											}}
											errors={errors[field]}
											touched={touched[field]}
										/>
									))}
								</div>
							)}

							<div>
								<Button
									type="submit"
									isLoading={isLoading}
									width="100%"
									text="Edit Product"
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

export default EditProduct;
