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
import { useGetAllCategories } from '../../hooks/useGetCategories';
import { useGetProductById } from '../../hooks/useGetProductById';
import { getQueryClient } from '../../shared/queryClient';
import { generateFilters } from '../../api/http/filters';

const EditProduct = () => {
	const navigate = useNavigate();

	const queryClient = getQueryClient;

	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const [activeFields, setActiveFields] = useState([]);

	const [files, setFiles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [imageRemoveIsLoading, setImageRemoveIsLoading] = useState(false);

	const [filters, setFilters] = useState([]);

	const { data: categories } = useGetAllCategories();

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
		activeFields?.forEach((field) => {
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

	const { data: product } = useGetProductById(id);

	formik.initialValues.title = product?.title;
	formik.initialValues.price = product?.price;
	formik.initialValues.stock = product?.stock;
	formik.initialValues.category = product?.category;
	formik.initialValues.specifications = product?.specifications;
	formik.initialValues.description = product?.description;

	const onSelectedCategoryChange = async (newCategory) => {
		let curCategory;
		categories?.forEach((category) => {
			if (category['name'] == newCategory) {
				curCategory = category;
			}
		});

		// Set fieldDetails to category details
		if (curCategory != null) {
			// Check if filters exist in query cache
			const filters = queryClient.getQueryData([
				'products',
				'admin',
				'filters',
				curCategory?.name,
			]);

			const activeFields = queryClient.getQueryData([
				'products',
				'admin',
				'activeFields',
				curCategory?.name,
			]);

			if (!filters && !activeFields) {
				console.log('Generate filters');
				const generatedFiltersRes = await generateFilters(curCategory?.name);
				const generatedFilters = generatedFiltersRes.data;

				// Set query data
				queryClient.setQueryData(
					['products', 'admin', 'filters', curCategory?.name],
					generatedFilters.filters
				);
				queryClient.setQueryData(
					['products', 'admin', 'activeFields', curCategory?.name],
					generatedFilters.activeFields
				);
				setFilters(generatedFilters?.filters);
				setActiveFields(generatedFilters?.activeFields);
			} else {
				setFilters(filters);
				setActiveFields(activeFields);
			}
		}
	};

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

	useEffect(() => {
		onSelectedCategoryChange(product?.category);

		if (product) {
			for (let detailsKey of Object.keys(product?.details)) {
				formik.setFieldValue(detailsKey, product?.details[detailsKey]);
			}
		}
	}, [product]);

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
									{product?.images &&
										product?.images != [] &&
										product?.images.map((prevFile, id) => {
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
									value={formik.values.category}
									onBlur={formik.handleBlur}
									onChange={(e) => {
										formik.setFieldValue('category', e.target.value);
										onSelectedCategoryChange(e.target.value);
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
