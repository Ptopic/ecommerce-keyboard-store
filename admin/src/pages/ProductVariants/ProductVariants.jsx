import React, { useState, useEffect } from 'react';

import './ProductVariants.css';
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import { toast, Toaster } from 'react-hot-toast';

import { Link, useLocation } from 'react-router-dom';
import { admin_request } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';

const ProductVariants = () => {
	const user = useSelector((state) => state.user);
	let userToken = user.currentUser.token;

	const location = useLocation();
	const id = location.pathname.split('/products/')[1].split('/variants')[0];

	const [product, setProduct] = useState();

	const [isLoading, setIsLoading] = useState(false);

	// Variants
	const [sizes, setSizes] = useState([]);
	const [colors, setColors] = useState([]);
	const [materials, setMaterials] = useState([]);

	const [combinations, setCombinations] = useState([]);

	const initialValues = {
		optionName: 'Select Option',
		optionValues: '',
	};

	const newProductVariantSchema = Yup.object().shape({
		optionName: Yup.string().required('Option name is required'),
	});

	// Get product info by id
	const getProductById = async () => {
		try {
			const res = await admin_request(userToken).get('/products/find/' + id);
			setProduct(res.data.data);
			console.log(res.data.data);
		} catch (error) {
			toast.error('Something went wrong');
		}
	};

	useEffect(() => {
		getProductById();
	}, []);

	const handleOptionNameChange = (e, setFieldValue) => {
		let optionName = e.target.value;

		setFieldValue('optionName', optionName);

		if (optionName === 'Size') {
			setFieldValue('optionValues', sizes.join(','));
		} else if (optionName === 'Material') {
			setFieldValue('optionValues', materials.join(','));
		} else if (optionName === 'Color') {
			setFieldValue('optionValues', colors.join(','));
		}
	};

	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	};

	const handleAddNewVariants = (values, formikActions) => {
		setIsLoading(true);
		let variantValues = values.optionValues.split(',');

		let formatedVariantValues = [];

		// Format values
		for (let string of variantValues) {
			formatedVariantValues.push(capitalizeFirstLetter(string.trim()));
		}

		let variantName = values.optionName;

		if (variantName === 'Size') {
			setSizes(formatedVariantValues);
		} else if (variantName === 'Color') {
			setColors(formatedVariantValues);
		} else if (variantName === 'Material') {
			setMaterials(formatedVariantValues);
		} else {
			toast.error('Wrong value selected');
		}

		formikActions.resetForm();
		setIsLoading(false);
	};

	// Render elements if any of the veriant changes (get permutation of them)
	useEffect(() => {
		let array = [];
		if (sizes.length > 0 && colors.length > 0 && materials.length > 0) {
			let firstHalf = sizes.flatMap((a) => colors.map((b) => a + '-' + b));
			let secondHalf = firstHalf.flatMap((a) =>
				materials.map((b) => a + '-' + b)
			);

			array = [...secondHalf];
		} else if (sizes.length > 0 && colors.length > 0) {
			let firstHalf = sizes.flatMap((a) => colors.map((b) => a + '-' + b));

			array = [...firstHalf];
		} else if (sizes.length > 0 && materials.length > 0) {
			let firstHalf = sizes.flatMap((a) => materials.map((b) => a + '-' + b));

			array = [...firstHalf];
		} else if (colors.length > 0 && materials.length > 0) {
			let firstHalf = colors.flatMap((a) => materials.map((b) => a + '-' + b));

			array = [...firstHalf];
		} else if (sizes.length > 0) {
			array = [...sizes];
		} else if (colors.length > 0) {
			array = [...colors];
		} else if (materials.length > 0) {
			array = [...materials];
		}

		// TODO Save to variants collection with product id (backend)

		// Set splitted compinations to display
		let displayCombinations = [];
		for (let el of array) {
			// Set splitted arrays as combinations to display them
			displayCombinations.push(el.split('-'));
		}

		console.log(displayCombinations);
		setCombinations(displayCombinations);
	}, [colors, sizes, materials]);

	// ----- Variations form stuff -----

	const handleVariationsValidation = Yup.object().shape({
		variations: Yup.array().of(
			Yup.object().shape({
				price: Yup.number().required('Price is required'),
				stock: Yup.number().required('Stock is required'),
				images: Yup.array(),
			})
		),
	});

	// {
	// 	price: 2,
	// 	stock: 22,
	// 	images: [],
	// },

	const formatVariationsInitialValues = () => {
		let array = [];
		for (let el of combinations) {
			let object = {};
			object['price'] = 2;
			object['stock'] = 22;
			object['images'] = [];
			array.push(object);
		}

		console.log(array);
		return array;
	};

	const variationsFormInitialValues = {
		variations: [...formatVariationsInitialValues()],
	};

	return (
		<div className="form">
			<Toaster />
			<h2>Add variants for product {product ? '- ' + product.title : null}</h2>

			<div className="box">
				<Formik
					enableReinitialize={false}
					initialValues={initialValues}
					validationSchema={newProductVariantSchema}
					onSubmit={(values, formikActions) =>
						handleAddNewVariants(values, formikActions)
					}
				>
					{({ errors, touched, values, setFieldValue }) => (
						<Form>
							<div className="form-container">
								<div className="row-variants">
									<div className="dropdown-container">
										<p>Option name</p>
										<div className="dropdown">
											<Field
												placeholder="Option name *"
												as="select"
												value={values.optionName}
												name="optionName"
												className="dropdown-select-field"
												onChange={(e) => {
													handleOptionNameChange(e, setFieldValue);
												}}
											>
												<option disabled>Select Option</option>
												<option value={'Size'}>Size</option>
												<option value={'Color'}>Color</option>
												<option value={'Material'}>Material</option>
											</Field>
										</div>
										{errors.optionName && touched.optionName ? (
											<div className="error">{errors.optionName}</div>
										) : null}
									</div>
									<div>
										<InputField
											type={'text'}
											name={'optionValues'}
											placeholder={
												'Option values (seperate values by a comma) *'
											}
											value={values.optionValues}
											onChange={(e) => {
												setFieldValue('optionValues', e.target.value);
											}}
											width={'100%'}
											errors={errors.optionValues}
											touched={touched.optionValues}
											required={false}
										/>
									</div>
									<div>
										<Button type="submit" isLoading={isLoading} text="Add" />
									</div>
								</div>
							</div>
						</Form>
					)}
				</Formik>

				{combinations.length > 0 && (
					<div className="variants-display">
						<div className="table-variations">
							<div className="table-variations-head">
								<div className="tr">
									<div className="td">
										<h2>Variant</h2>
									</div>
									<div className="td">
										<h2>Price</h2>
									</div>
									<div className="td">
										<h2>Stock</h2>
									</div>
									<div className="td">
										<h2>Images</h2>
									</div>
								</div>
							</div>

							<div className="table-variations-body">
								<Formik
									enableReinitialize={false}
									initialValues={variationsFormInitialValues}
									validationSchema={handleVariationsValidation}
									onSubmit={(values, formikActions) =>
										updateVariants(values, formikActions)
									}
								>
									{({ errors, touched, values, setFieldValue }) => (
										<Form>
											{values.variations.map((combination, i) => {
												console.log(combination);
												return (
													<div className="tr">
														<div className="td">
															{combinations[i][0]} {combinations[i][1]}
															{combinations[i][2]}
														</div>
														<div className="td">
															<InputField
																type={'text'}
																name={'optionValues'}
																placeholder={
																	'Option values (seperate values by a comma) *'
																}
																value={values.optionValues}
																onChange={(e) => {
																	setFieldValue('optionValues', e.target.value);
																}}
																width={'100%'}
																errors={errors.optionValues}
																touched={touched.optionValues}
																required={false}
															/>
														</div>
													</div>
												);
											})}
										</Form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductVariants;
