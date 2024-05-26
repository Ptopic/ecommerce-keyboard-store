import React, { useState, useEffect } from 'react';

// Styles
import './EditCategory.css';
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import AddFieldModal from '../../components/AddFieldModal/AddFieldModal';

import { toast, Toaster } from 'react-hot-toast';

import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import { admin_request, userRequest } from '../../api';

// Icons
import { FaTrash } from 'react-icons/fa';

function EditCategory() {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/edit/')[1];

	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [isLoading, setIsLoading] = useState(false);

	const [categoryData, setCategoryData] = useState(null);

	const [latestIndex, setLatestIndex] = useState(0);
	const [name, setName] = useState('');

	const [addFieldModalVisible, setAddFieldModalVisible] = useState(false);
	const [selectedFields, setSelectedFields] = useState([]);

	const newCategorySchema = Yup.object().shape({
		name: Yup.string().required('Category name is required'),
	});

	const initialValues = {
		name: name,
		fields: selectedFields,
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: newCategorySchema,
		onSubmit: async (values, formikActions) => {
			handleEditCategory(values, formikActions);
		},
	});

	const fetchCategoryById = async () => {
		try {
			const res = await userRequest.get('/categories/' + id);
			let fields = res.data.data.fields;
			let data = res.data.data;
			setCategoryData(data);

			formik.initialValues.name = data.name;
			formik.initialValues.fields = fields;

			// setName(data.name);
			setSelectedFields(fields);

			// Set latest index to latest field id

			setLatestIndex(fields.length);
		} catch (error) {
			console.log(error);
			toast.error(
				error.response.data.error
					? error.response.data.error
					: 'Failed to fetch data'
			);
		}
	};

	const handleEditCategory = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await userRequest.put('/categories/' + id, {
				...values,
				selectedFields,
			});
			formikActions.resetForm();
			setIsLoading(false);
			toast.success('Category updated successfully');
			navigate(0);
		} catch (error) {
			console.log(error);
			toast.error(
				error.response.data.error
					? error.response.data.error
					: 'Something went wrong'
			);
			setIsLoading(false);
		}
	};

	const openAddFieldModal = () => {
		document.body.style.overflow = 'hidden';
		setAddFieldModalVisible(true);
	};

	const closeAddFieldModal = () => {
		document.body.style.overflow = 'visible';
		setAddFieldModalVisible(false);
	};

	const removeSelectedItem = (id) => {
		setSelectedFields(selectedFields.filter((filter) => filter.id != id));
	};

	// Fetch category by id on page load
	useEffect(() => {
		fetchCategoryById();
	}, []);

	return (
		<div className="form">
			<Toaster />
			<h1>Edit Category</h1>

			<div className="box">
				<h2>Category Details:</h2>
				<div className="seperator-line"></div>

				<FormikProvider value={formik}>
					<Form className="form-container">
						<div>
							<InputField
								type={'text'}
								name={'name'}
								placeholder={'Category Name *'}
								value={formik.values.name}
								onChange={(e) => {
									formik.setFieldValue('name', e.target.value);
								}}
								errors={formik.errors.name}
								touched={formik.touched.name}
							/>
						</div>

						<div className="additional-info">
							<h2>Fields For Filtering:</h2>
							<div className="seperator-line"></div>
						</div>

						<div className="filter-fields-container">
							<button
								className="add-field-btn"
								type="button"
								onClick={() => openAddFieldModal()}
							>
								+
							</button>

							<div className="filter-fields">
								{selectedFields.length > 0 &&
									selectedFields.map((field, id) => {
										return (
											<div className="filter-field" key={id}>
												<h2>{field.name}</h2>
												<button
													className="delete-btn"
													type="button"
													onClick={() => removeSelectedItem(field.id)}
												>
													<FaTrash />
												</button>
											</div>
										);
									})}
							</div>

							{addFieldModalVisible && (
								<AddFieldModal
									closeModal={closeAddFieldModal}
									selectedFields={selectedFields}
									setSelectedFields={setSelectedFields}
									latestIndex={latestIndex}
									setLatestIndex={setLatestIndex}
								/>
							)}
						</div>

						<div className="login-form-submit">
							<Button
								type="submit"
								isLoading={isLoading}
								width="100%"
								text="Edit Category"
							/>
						</div>
					</Form>
				</FormikProvider>
			</div>
			<Link
				to={`/categories?page=${page}&pageSize=${pageSize}${
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
}

export default EditCategory;
