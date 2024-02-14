import React, { useState, useEffect, useRef } from 'react';

import './ProductVariants.css';
import '../../styles/forms.css';

// Formik
import { Formik, Form, Field, useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

import { toast, Toaster } from 'react-hot-toast';

import { Link, useLocation } from 'react-router-dom';
import { admin_request } from '../../api';
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop';
import VariantImagesModal from '../../components/VariantImagesModal/VariantImagesModal';

const VariationsFormikContext = () => {
	const { values, submitForm, setFieldValue } = useFormikContext();

	// // TEST remove later
	// useEffect(() => {
	// 	// variationsFormRef?.current?.values.variations[imagesModalId] = files;
	// 	// console.log(
	// 	// 	variationsFormRef.current.setFieldValue(
	// 	// 		`variations[${imagesModalId}].images`,
	// 	// 		files
	// 	// 	)
	// 	// );
	// 	console.log(values);
	// }, [values, submitForm]);
};

const ProductVariants = () => {
	const variationsFormRef = useRef(null);

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

	const [imagesModalVisible, setImagesModalVisible] = useState(false);
	const [imagesModalId, setImagesModalId] = useState(null);

	const [files, setFiles] = useState([]);

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

		// Filter if some values are empty
		let filteredDisplayCombinations = [];
		displayCombinations.forEach((combination) => {
			let cleanedArray = combination.filter((el) => el !== '');
			filteredDisplayCombinations.push(cleanedArray);
		});

		setCombinations(filteredDisplayCombinations);
	}, [colors, sizes, materials]);

	// ----- Variations form stuff -----

	const handleVariationsValidation = Yup.object().shape({
		variations: Yup.array().of(
			Yup.object().shape({
				price: Yup.number(),
				stock: Yup.number(),
				images: Yup.array(),
			})
		),
	});

	const formatVariationsInitialValues = () => {
		let array = [];
		combinations.forEach((el) => {
			let object = {};
			object['price'] = 0;
			object['stock'] = 0;
			object['images'] = [];
			array.push(object);
		});

		return array;
	};

	const variationsFormInitialValues = {
		variations: formatVariationsInitialValues(),
	};

	const updateVariants = (values, formikActions) => {
		// console.log(values);
		console.log(values);
	};

	// Open images upload modal
	const openImagesModal = (i) => {
		setImagesModalVisible(true);
		setImagesModalId(i);
	};

	return (
		<div className="form">
			<Toaster />
			<h2>Add variants for product {product ? '- ' + product.title : null}</h2>

			<div className="box">
				<Formik
					enableReinitialize={true}
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
									<div className="variants-add-btn-container">
										<input type="submit" value="Add" />
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
									enableReinitialize={true}
									initialValues={variationsFormInitialValues}
									validationSchema={handleVariationsValidation}
									innerRef={(f) => (variationsFormRef.current = f)}
									onSubmit={(values, formikActions) =>
										updateVariants(values, formikActions)
									}
								>
									{({ errors, touched, values, setFieldValue }) => (
										<Form>
											{combinations.map((combination, i) => {
												return (
													<div className="tr" key={i}>
														<div
															className={`td variants ${
																combination.length === 1 ? 'single' : ''
															}`}
														>
															<p className="color">{combinations[i][1]}</p>
															<p className="size">{combinations[i][0]}</p>
															<p className="material">{combinations[i][2]}</p>
														</div>
														<div className="td">
															<InputField
																type="number"
																name={`variations[${i}].price`}
																placeholder="Price *"
																value={values.variations[i]?.price || ''}
																onChange={(e) => {
																	setFieldValue(
																		`variations[${i}].price`,
																		e.target.value
																	);
																}}
																width="100%"
																errors={
																	errors.variations &&
																	errors.variations[i] &&
																	errors.variations[i].price
																}
																touched={
																	touched.variations &&
																	touched.variations[i] &&
																	touched.variations[i].price
																}
																required={true}
															/>
														</div>
														<div className="td">
															<InputField
																type="number"
																name={`variations[${i}].stock`}
																placeholder="Stock *"
																value={values.variations[i]?.stock || ''}
																onChange={(e) => {
																	setFieldValue(
																		`variations[${i}].stock`,
																		e.target.value
																	);
																}}
																width="100%"
																errors={
																	errors.variations &&
																	errors.variations[i] &&
																	errors.variations[i].stock
																}
																touched={
																	touched.variations &&
																	touched.variations[i] &&
																	touched.variations[i].stock
																}
																required={true}
															/>
														</div>
														{imagesModalVisible && (
															<VariantImagesModal
																id={imagesModalId}
																currentImages={
																	values.variations[imagesModalId].images
																}
																field={`variations[${imagesModalId}].images`}
																setFieldValue={setFieldValue}
																setImagesModalVisible={setImagesModalVisible}
															/>
														)}
														<div className="td images">
															<button
																type="button"
																onClick={() => openImagesModal(i)}
															>
																Images
															</button>
														</div>
													</div>
												);
											})}
											<div className="tr submit">
												<Button
													type="submit"
													isLoading={isLoading}
													width="100%"
													text="Save Variants"
												/>
											</div>
											<VariationsFormikContext />
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
