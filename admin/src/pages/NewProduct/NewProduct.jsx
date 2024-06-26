import React, { useState, useEffect } from 'react';

// Styles
import './NewProduct.css';
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setCategoriesArray } from '../../redux/categoriesRedux';
import { addFilter } from '../../redux/filtersRedux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { toast, Toaster } from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';
import { request, userRequest } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';

import { useSearchParams } from 'react-router-dom';
import { generateFilterProductAdmin } from '../../../../frontend/src/utils/filters';
import ProductFiltersDisplay from '../../components/ProductFiltersDisplay/ProductFiltersDisplay';
import { useGetAllCategories } from '../../hooks/useGetCategories';
import { getQueryClient } from '../../shared/queryClient';
import { useGenerateFilters } from '../../hooks/useGenerateFilters';
import { generateFilters } from '../../api/http/filters';

const NewProduct = () => {
	const navigate = useNavigate();
	const queryClient = getQueryClient;

	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

	const [selectedCategory, setSelectedCategory] = useState('');

	const [activeFields, setActiveFields] = useState([]);

	const [files, setFiles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

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
			setIsLoading(true);
			try {
				const res = await userRequest.post('/products', {
					...values,
					images: files,
					activeFields: activeFields,
				});

				toast.success('Product added successfully');
				navigate(0);
				formikActions.resetForm();
				setIsLoading(false);
				resetAllFormData();
			} catch (error) {
				toast.error(
					error.response.data.error
						? 'Product already exists'
						: 'Something went wrong'
				);
				formikActions.resetForm();
				navigate(0);
				setIsLoading(false);
				resetAllFormData();
			}
		}
	};

	const dragAndDropOnChange = (e) => {
		setFieldValue('files', e.target.files[0]);
	};

	const onSelectedCategoryChange = async (selectedCategory) => {
		// Find selected category in category data
		let curCategory;
		categories?.forEach((category) => {
			if (category['name'] == selectedCategory) {
				curCategory = category;
			}
		});

		// Check for cached filters or cache them

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
				const generatedFilters = generatedFiltersRes?.data;

				// Set query data
				queryClient.setQueryData(
					['products', 'admin', 'filters', curCategory?.name],
					generatedFilters?.filters
				);
				queryClient.setQueryData(
					['products', 'admin', 'activeFields', curCategory?.name],
					generatedFilters?.activeFields
				);
				setFilters(generatedFilters?.filters);
				setActiveFields(generatedFilters?.activeFields);
			} else {
				setFilters(filters);
				setActiveFields(activeFields);
			}
		}
	};

	const getActiveFieldsValidationSchema = () => {
		let schema = {};
		activeFields &&
			activeFields?.forEach((field) => {
				schema[field] = Yup.string().required(`${field} is required`);
			});
		return schema;
	};

	const newProductSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		description: Yup.string(),
		specifications: Yup.string(),
		category: Yup.string()
			.required('Category is required')
			.notOneOf(['Select category'], 'Please select a category'),
		price: Yup.number().required('Price is required'),
		stock: Yup.number().required('Stock is required'),
		files: Yup.array().required('Files are required'),
		// ...getActiveFieldsValidationSchema(), // Add validation schema for active fields
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
			handleAddNewProduct(values, formikActions);
		},
	});

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Product</h1>

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
								onChange={(e) => {
									formik.setFieldValue('title', e.target.value);
								}}
								onBlur={formik.handleBlur}
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
										onChange={(e) => {
											formik.setFieldValue('price', e.target.value);
										}}
										onBlur={formik.handleBlur}
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
										onChange={(e) => {
											formik.setFieldValue('stock', e.target.value);
										}}
										onBlur={formik.handleBlur}
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
										formik.setFieldValue('category', e.target.value);
										onSelectedCategoryChange(e.target.value);
									}}
									onBlur={formik.handleBlur}
								>
									<option disabled>Select category</option>
									{categories?.map((category, id) => {
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
								text="Add new Product"
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
				reloadDocument
			>
				Back
			</Link>
		</div>
	);
};

export default NewProduct;
