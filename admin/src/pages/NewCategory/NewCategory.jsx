import React, { useState, useEffect } from 'react';

// Styles
import './NewCategory.css';
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

import { Link, useSearchParams } from 'react-router-dom';
import { admin_request } from '../../api';

// Icons
import { FaTrash } from 'react-icons/fa';

function NewCategory() {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = useState(
		searchParams ? searchParams.get('page') : null
	);

	const [latestIndex, setLatestIndex] = useState(0);
	const [name, setName] = useState('');

	const [isLoading, setIsLoading] = useState(false);

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
			handleAddNewCategory(values, formikActions);
		},
	});

	const handleAddNewCategory = async (values, formikActions) => {
		setIsLoading(true);
		try {
			const res = await admin_request(userToken).post('/categories', {
				...values,
				selectedFields,
			});
			console.log(res);
			toast.success('Category added successfully');

			// Reset form
			setSelectedFields([]);

			formik.resetForm();

			setIsLoading(false);
		} catch (error) {
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

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Category</h1>

			<div className="box">
				<h2>Category Details:</h2>
				<div className="seperator-line"></div>
				<FormikProvider>
					<form onSubmit={formik.handleSubmit}>
						<div className="form-container">
							<InputField
								type={'text'}
								name={'name'}
								placeholder={'Category Name *'}
								value={formik.values.name}
								onChange={(e) => {
									formik.setFieldValue('name', e.target.value);
								}}
								onBlur={formik.handleBlur}
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
									selectedFields.map((field) => {
										return (
											<div className="filter-field" key={field.id}>
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

						<div>
							<Button
								type="submit"
								isLoading={isLoading}
								width="100%"
								text="Add new Category"
							/>
						</div>
					</form>
				</FormikProvider>
			</div>
			<Link to={`/categories?page=${page}`} className="back-btn">
				Back
			</Link>
		</div>
	);
}

export default NewCategory;
