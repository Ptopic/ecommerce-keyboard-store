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
import { admin_request, request } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';

import { useSearchParams } from 'react-router-dom';

const NewProduct = () => {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(
		searchParams ? searchParams.get('page') : null
	);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	const [activeFields, setActiveFields] = useState([]);

	const [specifications, setSpecifications] = useState('');
	const [description, setDescription] = useState('');

	const [files, setFiles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	const [filters, setFilters] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);

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
			['link', 'image', 'video'],
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
		'video',
	];

	const resetAllFormData = () => {
		setSpecifications('');
		setDescription('');
		setFiles([]);
		setActiveFields([]);
		setSelectedCategory('');
	};

	const handleAddNewProduct = async (values, formikActions) => {
		if (files?.length != 0) {
			console.log(values);

			setIsLoading(true);
			try {
				const res = await admin_request(userToken).post('/products', {
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
			} catch (error) {
				if (error?.response?.data?.error) {
					toast.error('Product already exists');
				} else {
					toast.error('Something went wrong');
				}
				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
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

	// Get all categories options
	useEffect(() => {
		getAllCategories();
	}, []);

	const dragAndDropOnChange = (e) => {
		setFieldValue('files', e.target.files[0]);
	};

	const onSelectedCategoryChange = async () => {
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

			// Get all products by category to generate filters for it
			const allProductsRes = await request.get(
				`/products/filters/` + selectedCategory,
				{
					params: {
						activeFilters: activeFilters != [] ? activeFilters : null,
					},
				}
			);

			let productsData = allProductsRes.data.data;

			// Get category by name
			let categoryFields = curCategory.fields;

			let filtersArray = [];
			let initialFiltersArray = [];

			if (initialFiltersArray.length == 0) {
				for (let filter of categoryFields) {
					let obj = {};
					let initialFilter = {};
					obj[filter.name] = new Set([]);
					initialFilter[filter.name] = '';
					filtersArray.push(obj);
					initialFiltersArray.push(initialFilter);
				}
			}

			setActiveFilters(initialFiltersArray);

			for (let product of productsData) {
				// Loop thru all products details
				for (let i = 0; i < categoryFields.length; i++) {
					let filterName = categoryFields[i].name;

					let productFilter = product.details[filterName.toString()];

					let filterSet = filtersArray[i][filterName.toString()];

					filterSet.add(productFilter);
				}
			}

			// Loop thru all filters to sort its sets
			for (let j = 0; j < filtersArray.length; j++) {
				let curSet = Object.values(filtersArray[j])[0];

				// Sort filter set
				let sortedArrayFromSet = Array.from(curSet).sort((a, b) =>
					('' + a).localeCompare(b, undefined, { numeric: true })
				);

				curSet.clear();

				// Add sorted values back into set
				for (let value of sortedArrayFromSet) {
					curSet.add(value);
				}
			}

			setFilters(filtersArray);

			setActiveFields(namesOfActiveFields);
		}
	};

	useEffect(() => {
		onSelectedCategoryChange();
	}, [selectedCategory]);

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
		files: Yup.array().required('Files are required'),
		...getActiveFieldsValidationSchema(), // Add validation schema for active fields
	});

	const getInitialValuesForActiveFields = () => {
		let initialValues = {};
		activeFields.forEach((field) => {
			initialValues[field] = '';
		});
		return initialValues;
	};

	const initialValues = {
		title: '',
		description: '',
		specifications: '',
		category: 'Select category',
		price: '',
		stock: '',
		files: [],
		...getInitialValuesForActiveFields(),
	};

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Product</h1>

			<div className="box">
				<h2>Product Information:</h2>
				<div className="seperator-line"></div>
				<Formik
					enableReinitialize={false}
					initialValues={initialValues}
					validationSchema={newProductSchema}
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
									{files?.length == 0 ? (
										<div className="error">Files are required</div>
									) : null}
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
										<h2>Product Details (Case-sensitive):</h2>
										<div className="seperator-line"></div>
									</div>

									{activeFields.map((field, index) => (
										<>
											<InputField
												key={index}
												type="text"
												name={field}
												placeholder={field}
												value={values[field]}
												onChange={(e) => setFieldValue(field, e.target.value)}
												errors={errors[field]}
												touched={touched[field]}
											/>
											<div className="previous-filters">
												{filters &&
													Array.from(Object.values(filters[index])[0]).map(
														(el) => {
															return (
																<div
																	className="previous-filter"
																	onClick={() => setFieldValue(field, el)}
																>
																	<p>{el}</p>
																</div>
															);
														}
													)}
											</div>
										</>
									))}
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
			<Link to={`/products?page=${page}`} className="back-btn">
				Back
			</Link>
		</div>
	);
};

export default NewProduct;
