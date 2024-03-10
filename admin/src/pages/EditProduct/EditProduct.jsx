import React, { useState, useEffect, useMemo } from 'react';

// Styles
import './EditProduct.css';
import '../NewProduct/NewProduct.css';
import '../../styles/forms.css';

// Icons
import { IoClose } from 'react-icons/io5';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { addFilter } from '../../redux/filtersRedux';
import { setCategoriesArray } from '../../redux/categoriesRedux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { toast, Toaster } from 'react-hot-toast';

import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import { userRequest } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';
import Spinner from '../../components/Spinner/Spinner';

// Utils
import { generateFilterProductAdmin } from '../../../../frontend/src/utils/filters';
import ProductFiltersDisplay from '../../components/ProductFiltersDisplay/ProductFiltersDisplay';

const EditProduct = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const categoriesRedux = useSelector((state) => state.categories.data);
	const reduxFilters = useSelector((state) => state.filters);

	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const [product, setProduct] = useState([]);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	const [activeFields, setActiveFields] = useState([]);

	const [files, setFiles] = useState([]);
	const [previousFiles, setPreviousFiles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [imageRemoveIsLoading, setImageRemoveIsLoading] = useState(false);

	const [filters, setFilters] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);
	const [isFiltersLoading, setIsFiltersLoading] = useState(null);

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

	const initialValues = {
		title: '',
		description: '',
		specifications: '',
		category: 'Select category',
		price: '',
		stock: '',
		files: [],
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: newProductSchema,
		onSubmit: async (values, formikActions) => {
			handleEditProduct(values, formikActions);
		},
	});

	const handleEditProduct = async (values, formikActions) => {
		if (files?.length != 0) {
			setIsLoading(true);
			try {
				const res = await userRequest.put('/products/' + id, {
					...values,
					images: files,
					activeFields: activeFields,
				});

				toast.success('Product added successfully');
				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
				navigate(0);
			} catch (error) {
				toast.error(
					error.response.data.error
						? 'Product already exists'
						: 'Something went wrong'
				);
				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
			}
		} else {
			setIsLoading(true);
			try {
				const res = await userRequest.put('/products/' + id, {
					...values,
					activeFields: activeFields,
				});

				toast.success('Product added successfully');
				formikActions.resetForm();
				setIsLoading(false);
				navigate(-1);
			} catch (error) {
				toast.error(
					error.response.data.error
						? 'Product already exists'
						: 'Something went wrong'
				);

				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
			}
		}
	};

	const getAllCategories = async () => {
		// Cache categories in redux persist store
		if (categoriesRedux.length == 0) {
			try {
				const res = await request('/categories');
				dispatch(setCategoriesArray({ categories: res.data.data }));
				setCategories(res.data.data);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log('Cached categories');
			setCategories(categoriesRedux);
		}
	};

	const getProduct = async () => {
		try {
			await userRequest.get('/products/find/' + id).then((res) => {
				let productData = res.data.data;

				formik.initialValues.title = productData?.title;
				formik.initialValues.price = productData?.price;
				formik.initialValues.stock = productData?.stock;
				formik.initialValues.category = productData?.category;
				formik.initialValues.specifications = productData?.specifications;
				formik.initialValues.description = productData?.description;
				setSelectedCategory(productData?.category);

				setProduct(productData);

				setPreviousFiles(productData.images);

				// Set form values as product details values
				for (let detailsKey of Object.keys(productData.details)) {
					formik.setFieldValue(detailsKey, productData.details[detailsKey]);
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleInitilaFiltersGeneration = async () => {
		// Check for cached filters or cache them
		setIsFiltersLoading(true);
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

			let isCategoryFiltersCached;
			let isCategoryActiveFiltersCached;

			if (reduxFilters.filters && reduxFilters.filters.length > 0) {
				for (let reduxFilter of reduxFilters?.filters) {
					if (Object.keys(reduxFilter) == curCategory.name) {
						isCategoryFiltersCached = reduxFilter;
					}
				}
			}

			if (
				reduxFilters?.activeFilters &&
				reduxFilters.activeFilters.length > 0
			) {
				for (let reduxActiveFilter of reduxFilters?.activeFilters) {
					if (Object.keys(reduxActiveFilter) == curCategory.name) {
						isCategoryActiveFiltersCached = reduxActiveFilter;
					}
				}
			}

			if (!isCategoryFiltersCached && !isCategoryActiveFiltersCached) {
				generateFilterProductAdmin(
					selectedCategory,
					activeFilters,
					curCategory,
					setFilters,
					setActiveFilters,
					setActiveFields,
					namesOfActiveFields,
					setIsFiltersLoading
				)
					.then((res) => {
						dispatch(
							addFilter({
								categoryName: curCategory.name,
								filters: res?.filters,
								activeFilters: res?.activeFilters,
							})
						);
					})
					.catch((err) => console.log(err));
			} else {
				console.log('Cached filters');
				setFilters(structuredClone(isCategoryFiltersCached[curCategory.name]));
				setActiveFields(namesOfActiveFields);
			}
		}
	};

	const handleOnCategoryChangeFiltersGeneration = async (newCategory) => {
		// Check for cached filters or cache them

		// Find selected category in category data
		newCategory ? setSelectedCategory(newCategory) : null;

		let curCategory;
		categories.forEach((category) => {
			if (newCategory) {
				if (category['name'] == newCategory) {
					curCategory = category;
				}
			} else {
				if (category['name'] == selectedCategory) {
					curCategory = category;
				}
			}
		});

		// Set fieldDetails to category details
		if (curCategory != null) {
			// Format active fields
			const namesOfActiveFields = curCategory.fields.map((field) => field.name);

			let isCategoryFiltersCached;
			let isCategoryActiveFiltersCached;

			if (reduxFilters.filters && reduxFilters.filters.length > 0) {
				for (let reduxFilter of reduxFilters?.filters) {
					if (Object.keys(reduxFilter) == curCategory.name) {
						isCategoryFiltersCached = reduxFilter;
					}
				}
			}

			if (
				reduxFilters?.activeFilters &&
				reduxFilters.activeFilters.length > 0
			) {
				for (let reduxActiveFilter of reduxFilters?.activeFilters) {
					if (Object.keys(reduxActiveFilter) == curCategory.name) {
						isCategoryActiveFiltersCached = reduxActiveFilter;
					}
				}
			}

			if (!isCategoryFiltersCached && !isCategoryActiveFiltersCached) {
				generateFilterProductAdmin(
					newCategory,
					activeFilters,
					curCategory,
					setFilters,
					setActiveFilters,
					setActiveFields,
					namesOfActiveFields
				)
					.then((res) => {
						dispatch(
							addFilter({
								categoryName: curCategory.name,
								filters: res?.filters,
								activeFilters: res?.activeFilters,
							})
						);
					})
					.catch((err) => console.log(err));
			} else {
				console.log('Cached filters');
				setFilters(structuredClone(isCategoryFiltersCached[curCategory.name]));
				setActiveFields(namesOfActiveFields);
			}
		}
	};

	// Get all categories options
	useEffect(() => {
		getAllCategories();
		getProduct();

		handleInitilaFiltersGeneration();
	}, []);

	useMemo(() => {
		handleInitilaFiltersGeneration();
	}, [product, selectedCategory]);

	const dragAndDropOnChange = (e) => {
		formik.setFieldValue('files', e.target.files[0]);
	};

	const removePreviousImage = async (e, productImageId) => {
		setImageRemoveIsLoading(true);

		try {
			await userRequest
				.delete('/products/image/' + id, {
					data: { productImageId: productImageId },
				})
				.then((res) => {
					navigate(0);
				});
		} catch (error) {
			toast.error(
				error.response.data.error
					? error.response.data.error
					: 'Something went wrong'
			);
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

				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit}>
						<div className="form-container">
							<InputField
								type={'text'}
								name={'title'}
								placeholder={'Title *'}
								value={formik.values.title}
								onBlur={formik.handleBlur}
								onChange={(e) => {
									formik.setFieldValue('title', e.target.value);
								}}
								errors={formik.errors.title}
								touched={formik.touched.title}
							/>
							<div className="row">
								<div>
									<InputField
										type={'text'}
										name={'price'}
										placeholder={'Price *'}
										value={formik.values.price}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.setFieldValue('price', e.target.value);
										}}
										errors={formik.errors.price}
										touched={formik.touched.price}
									/>
								</div>

								<div>
									<InputField
										type={'number'}
										name={'stock'}
										placeholder={'Stock *'}
										value={formik.values.stock}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.setFieldValue('stock', e.target.value);
										}}
										errors={formik.errors.stock}
										touched={formik.touched.stock}
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
									value={formik.values.specifications}
									onChange={(newValue) => {
										formik.setFieldValue('specifications', newValue);
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
									value={formik.values.description}
									onChange={(newValue) => {
										formik.setFieldValue('description', newValue);
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
									{previousFiles &&
										previousFiles != [] &&
										previousFiles.map((prevFile, id) => {
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
									value={selectedCategory}
									onBlur={formik.handleBlur}
									onChange={(e) => {
										formik.setFieldValue('category', e.target.value);
										setSelectedCategory(e.target.value);
										handleOnCategoryChangeFiltersGeneration(e.target.value);
									}}
								>
									<option disabled>Select category</option>
									{categories &&
										categories.map((category, id) => {
											return (
												<option value={category.name} key={id}>
													{category.name}
												</option>
											);
										})}
								</Field>
							</div>
							{formik.errors.category && formik.touched.category ? (
								<div className="error">{formik.errors.category}</div>
							) : null}
						</div>

						{/* {isFiltersLoading && <div>Loading</div>} */}

						{activeFields && (
							<ProductFiltersDisplay
								activeFields={activeFields}
								filters={filters}
								formik={formik}
							/>
						)}

						<div>
							<Button
								type="submit"
								isLoading={isLoading}
								width="100%"
								text="Edit Product"
							/>
						</div>
					</form>
				</FormikProvider>
			</div>
			<Link
				to={`/products?page=${page}&pageSize=${pageSize}${
					sort != null ? '&sort=' + sort : ''
				}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}`}
				className="back-btn"
			>
				Back
			</Link>
		</div>
	);
};

export default EditProduct;
