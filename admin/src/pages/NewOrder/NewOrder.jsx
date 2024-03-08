import React, { useState } from 'react';

// Formik
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Icons
import { IoMdCheckmark } from 'react-icons/io';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../../redux/orderProductsRedux';

// Components
import Button from '../../../../frontend/src/components/Button/Button';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Styles
import './NewOrder.css';
import '../../../../frontend/src/pages/Checkout/Checkout.css';

import { toast, Toaster } from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';
import { request, userRequest } from '../../api';

import { useSearchParams } from 'react-router-dom';
import OrderAddProducts from '../../components/OrderAddProducts/OrderAddProducts';

const NewOrder = () => {
	const orderProductsRedux = useSelector((state) => state.orderProducts);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [r1, setR1] = useState(false);
	const [dostava, setDostava] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();

	// Query params from url
	const page = searchParams ? searchParams.get('page') : null;
	const pageSize = searchParams ? searchParams.get('pageSize') : null;
	const sort = searchParams ? searchParams.get('sort') : null;
	const direction = searchParams ? searchParams.get('direction') : null;
	const searchTermValue = searchParams ? searchParams.get('search') : null;

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		firstName: Yup.string().required('Ime is required'),
		lastName: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
	});

	const validationSchemaWithR1 = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		tvrtka: Yup.string().required('Tvrtka is required'),
		oib: Yup.number().required('OIB is required'),
		firstName: Yup.string().required('Ime is required'),
		lastName: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
	});

	const validationSchemaWithDostava = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		firstName: Yup.string().required('Ime is required'),
		lastName: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
		// Additional shipping info
		ime2: Yup.string().required('Ime is required'),
		prezime2: Yup.string().required('Prezime is required'),
		mjesto2: Yup.string().required('Mjesto is required'),
		zip2: Yup.number().required('Zip is required'),
		adresa2: Yup.string().required('Adresa is required'),
		telefon2: Yup.number().required('Telefon is required'),
	});

	const validationSchemaWithDostavaAndR1 = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		tvrtka: Yup.string().required('Tvrtka is required'),
		oib: Yup.number().required('OIB is required'),
		firstName: Yup.string().required('Ime is required'),
		lastName: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
		// Additional shipping info
		ime2: Yup.string().required('Ime is required'),
		tvrtka2: Yup.string().required('Tvrtka is required'),
		prezime2: Yup.string().required('Prezime is required'),
		mjesto2: Yup.string().required('Mjesto is required'),
		zip2: Yup.number().required('Zip is required'),
		adresa2: Yup.string().required('Adresa is required'),
		telefon2: Yup.number().required('Telefon is required'),
	});

	const initialValues = {
		email: '',
		tvrtka: '',
		oib: '',
		firstName: '',
		lastName: '',
		mjesto: '',
		zip: '',
		adresa: '',
		telefon: '',
		// Additional shipping info
		tvrtka2: '',
		ime2: '',
		prezime2: '',
		mjesto2: '',
		zip2: '',
		adresa2: '',
		telefon2: '',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema:
			dostava && r1
				? validationSchemaWithDostavaAndR1
				: r1
				? validationSchemaWithR1
				: dostava
				? validationSchemaWithDostava
				: validationSchema,
		onSubmit: async (values, formikActions) => {
			addNewOrder(values, formikActions);
		},
	});

	const addNewOrder = async (values, formikActions) => {
		// If amount is lower than 20 add 3 € shipping
		let amount = orderProductsRedux.totalPrice;
		if (amount < 20) {
			amount = amount + 3;
		}

		const billingDetails = {
			name: values.firstName + ' ' + values.lastName,
			email: values.email,
			phone: values.telefon,
			address: {
				city: values.mjesto,
				country: 'HR',
				line1: values.adresa,
				line2: '',
				postal_code: values.zip,
			},
		};

		const shippingDetails = {
			name: dostava
				? values.ime2 + ' ' + values.prezime2
				: values.firstName + ' ' + values.lastName,
			address: {
				city: dostava ? values.mjesto2 : values.mjesto,
				country: 'HR',
				line1: dostava ? values.adresa2 : values.adresa,
				line2: '',
				postal_code: dostava ? values.zip2 : values.zip,
			},
			phone: dostava ? values.telefon2 : values.telefon,
			carrier: 'DPD',
			tracking_number: '123456789',
		};

		const tvrtka = values.tvrtka;
		const tvrtkaDostava = dostava ? values.tvrtka2 : values.tvrtka;
		const oib = values.oib;

		try {
			const res = await userRequest.post('/orders', {
				...values,
				billingDetails,
				shippingDetails,
				tvrtka,
				tvrtkaDostava,
				oib,
				amount: amount,
				products: [...orderProductsRedux.orderProducts],
			});

			formikActions.resetForm();

			// Reset orderProducts formik
			dispatch(resetState());
			toast.success('Order created succesfully');
		} catch (error) {
			toast.error(
				error.response.data.error
					? error.response.data.error
					: 'Something went wrong'
			);
		}
	};

	return (
		<div className="form">
			<Toaster />
			<h1>Add new Order</h1>

			<div className="box">
				<h2>Order Information:</h2>
				<div className="seperator-line"></div>

				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit} className="order-form">
						<div className="form-container">
							<div className="checkout-content-left">
								<h2>PODACI ZA DOSTAVU RAČUNA</h2>
								<div className="seperator-line"></div>
								<div className="checkout-checkbox">
									<button
										type="button"
										style={{
											background: r1 ? '#E81123' : '#fff',
											border: r1 ? 'none' : '1px solid black',
										}}
										onClick={() => (r1 ? setR1(false) : setR1(true))}
									>
										{r1 ? <IoMdCheckmark color={'white'} size={24} /> : null}
									</button>
									<p>Trebam R1 Račun</p>
								</div>

								{/* ----- Mobile details forms ----- */}
								<div className="checkout-form-mobile">
									<InputField
										type={'text'}
										name={'email'}
										placeholder={'Email *'}
										value={formik.values.email}
										onChange={(e) =>
											formik.setFieldValue('email', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.email}
										touched={formik.touched.email}
									/>
									{r1 && (
										<>
											<InputField
												type={'text'}
												name={'tvrtka'}
												placeholder={'Tvrtka *'}
												value={formik.values.tvrtka}
												onChange={(e) =>
													formik.setFieldValue('tvrtka', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.tvrtka}
												touched={formik.touched.tvrtka}
											/>
										</>
									)}
									{r1 && (
										<>
											<InputField
												type={'number'}
												name={'oib'}
												placeholder={'OIB *'}
												value={formik.values.oib}
												onChange={(e) =>
													formik.setFieldValue('oib', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.oib}
												touched={formik.touched.oib}
											/>
										</>
									)}
									<InputField
										type={'text'}
										name={'firstName'}
										placeholder={'First Name *'}
										value={formik.values.firstName}
										onChange={(e) =>
											formik.setFieldValue('firstName', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.firstName}
										touched={formik.touched.firstName}
									/>
									<InputField
										type={'text'}
										name={'lastName'}
										placeholder={'Last Name *'}
										value={formik.values.lastName}
										onChange={(e) =>
											formik.setFieldValue('lastName', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.lastName}
										touched={formik.touched.lastName}
									/>
									<InputField
										type={'text'}
										name={'adresa'}
										placeholder={'Adresa *'}
										value={formik.values.adresa}
										onChange={(e) =>
											formik.setFieldValue('adresa', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.adresa}
										touched={formik.touched.adresa}
									/>
									<InputField
										type={'text'}
										name={'mjesto'}
										placeholder={'Mjesto *'}
										value={formik.values.mjesto}
										onChange={(e) =>
											formik.setFieldValue('mjesto', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.mjesto}
										touched={formik.touched.mjesto}
									/>
									<InputField
										type={'text'}
										name={'zip'}
										placeholder={'Poštanski broj *'}
										value={formik.values.zip}
										onChange={(e) =>
											formik.setFieldValue('zip', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.zip}
										touched={formik.touched.zip}
									/>
									<InputField
										type={'text'}
										name={'telefon'}
										placeholder={'Telefon *'}
										value={formik.values.telefon}
										onChange={(e) =>
											formik.setFieldValue('telefon', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.telefon}
										touched={formik.touched.telefon}
									/>
								</div>

								{/* ----- Desktop details forms -----*/}
								<div className="checkout-form">
									<InputField
										type={'text'}
										name={'email'}
										placeholder={'Email *'}
										value={formik.values.email}
										onChange={(e) =>
											formik.setFieldValue('email', e.target.value)
										}
										onBlur={formik.handleBlur}
										errors={formik.errors.email}
										touched={formik.touched.email}
										fullWidth={true}
									/>
									<div className="checkout-form-left">
										{r1 && (
											<>
												<InputField
													type={'text'}
													name={'tvrtka'}
													placeholder={'Tvrtka *'}
													value={formik.values.tvrtka}
													onChange={(e) =>
														formik.setFieldValue('tvrtka', e.target.value)
													}
													onBlur={formik.handleBlur}
													errors={formik.errors.tvrtka}
													touched={formik.touched.tvrtka}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'firstName'}
											placeholder={'First Name *'}
											value={formik.values.firstName}
											onChange={(e) =>
												formik.setFieldValue('firstName', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.firstName}
											touched={formik.touched.firstName}
										/>
										<InputField
											type={'text'}
											name={'mjesto'}
											placeholder={'Mjesto *'}
											value={formik.values.mjesto}
											onChange={(e) =>
												formik.setFieldValue('mjesto', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.mjesto}
											touched={formik.touched.mjesto}
										/>
										<InputField
											type={'text'}
											name={'adresa'}
											placeholder={'Adresa *'}
											value={formik.values.adresa}
											onChange={(e) =>
												formik.setFieldValue('adresa', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.adresa}
											touched={formik.touched.adresa}
										/>
									</div>

									<div className="checkout-form-right">
										{r1 && (
											<>
												<InputField
													type={'number'}
													name={'oib'}
													placeholder={'OIB *'}
													value={formik.values.oib}
													onChange={(e) =>
														formik.setFieldValue('oib', e.target.value)
													}
													onBlur={formik.handleBlur}
													errors={formik.errors.oib}
													touched={formik.touched.oib}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'lastName'}
											placeholder={'Prezime *'}
											value={formik.values.lastName}
											onChange={(e) =>
												formik.setFieldValue('lastName', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.lastName}
											touched={formik.touched.lastName}
										/>
										<InputField
											type={'number'}
											name={'zip'}
											placeholder={'Poštanski broj *'}
											value={formik.values.zip}
											onChange={(e) =>
												formik.setFieldValue('zip', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.zip}
											touched={formik.touched.zip}
										/>
										<InputField
											type={'text'}
											name={'telefon'}
											placeholder={'Telefon *'}
											value={formik.values.telefon}
											onChange={(e) =>
												formik.setFieldValue('telefon', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.telefon}
											touched={formik.touched.telefon}
										/>
									</div>
								</div>

								<h2>PODACI ZA DOSTAVU PROIZVODA</h2>
								<div className="seperator-line"></div>
								<div className="checkout-checkbox">
									<button
										type="button"
										style={{
											background: dostava ? '#fff' : '#E81123',
											border: dostava ? '1px solid black' : 'none',
										}}
										onClick={() =>
											dostava ? setDostava(false) : setDostava(true)
										}
									>
										{dostava ? null : (
											<IoMdCheckmark color={'white'} size={24} />
										)}
									</button>
									<p>Podaci za dostavu jednaki su podacima za dostavu računa</p>
								</div>

								{/* ----- Mobile details form dostava ----- */}
								{dostava && (
									<div className="checkout-form-mobile">
										{r1 && (
											<>
												<InputField
													type={'text'}
													name={'tvrtka2'}
													placeholder={'Tvrtka *'}
													value={formik.values.tvrtka2}
													onChange={(e) =>
														formik.setFieldValue('tvrtka2', e.target.value)
													}
													onBlur={formik.handleBlur}
													errors={formik.errors.tvrtka2}
													touched={formik.touched.tvrtka2}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'ime2'}
											placeholder={'Ime *'}
											value={formik.values.ime2}
											onChange={(e) =>
												formik.setFieldValue('ime2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.ime2}
											touched={formik.touched.ime2}
										/>

										<InputField
											type={'text'}
											name={'prezime2'}
											placeholder={'Prezime *'}
											value={formik.values.prezime2}
											onChange={(e) =>
												formik.setFieldValue('prezime2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.prezime2}
											touched={formik.touched.prezime2}
										/>

										<InputField
											type={'text'}
											name={'adresa2'}
											placeholder={'Adresa *'}
											value={formik.values.adresa2}
											onChange={(e) =>
												formik.setFieldValue('adresa2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.adresa2}
											touched={formik.touched.adresa2}
										/>

										<InputField
											type={'text'}
											name={'mjesto2'}
											placeholder={'Mjesto *'}
											value={formik.values.mjesto2}
											onChange={(e) =>
												formik.setFieldValue('mjesto2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.mjesto2}
											touched={formik.touched.mjesto2}
										/>

										<InputField
											type={'text'}
											name={'zip2'}
											placeholder={'Poštanski broj *'}
											value={formik.values.zip2}
											onChange={(e) =>
												formik.setFieldValue('zip2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.zip2}
											touched={formik.touched.zip2}
										/>

										<InputField
											type={'text'}
											name={'telefon2'}
											placeholder={'Telefon *'}
											value={formik.values.telefon2}
											onChange={(e) =>
												formik.setFieldValue('telefon2', e.target.value)
											}
											onBlur={formik.handleBlur}
											errors={formik.errors.telefon2}
											touched={formik.touched.telefon2}
										/>
									</div>
								)}
								{/* ----- Desktop details form dostava ----- */}
								{dostava && (
									<div className="checkout-form">
										{r1 && (
											<>
												<InputField
													type={'text'}
													name={'tvrtka2'}
													placeholder={'Tvrtka *'}
													value={formik.values.tvrtka2}
													onChange={(e) =>
														formik.setFieldValue('tvrtka2', e.target.value)
													}
													onBlur={formik.handleBlur}
													errors={formik.errors.tvrtka2}
													touched={formik.touched.tvrtka2}
													fullWidth={true}
												/>
											</>
										)}
										<div className="checkout-form-left">
											<InputField
												type={'text'}
												name={'ime2'}
												placeholder={'Ime *'}
												value={formik.values.ime2}
												onChange={(e) =>
													formik.setFieldValue('ime2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.ime2}
												touched={formik.touched.ime2}
											/>
											<InputField
												type={'text'}
												name={'mjesto2'}
												placeholder={'Mjesto *'}
												value={formik.values.mjesto2}
												onChange={(e) =>
													formik.setFieldValue('mjesto2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.mjesto2}
												touched={formik.touched.mjesto2}
											/>
											<InputField
												type={'text'}
												name={'adresa2'}
												placeholder={'Adresa *'}
												value={formik.values.adresa2}
												onChange={(e) =>
													formik.setFieldValue('adresa2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.adresa2}
												touched={formik.touched.adresa2}
											/>
										</div>
										<div className="checkout-form-right">
											<InputField
												type={'text'}
												name={'prezime2'}
												placeholder={'Prezime *'}
												value={formik.values.prezime2}
												onChange={(e) =>
													formik.setFieldValue('prezime2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.prezime2}
												touched={formik.touched.prezime2}
											/>
											<InputField
												type={'text'}
												name={'zip2'}
												placeholder={'Poštanski broj *'}
												value={formik.values.zip2}
												onChange={(e) =>
													formik.setFieldValue('zip2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.zip2}
												touched={formik.touched.zip2}
											/>
											<InputField
												type={'text'}
												name={'telefon2'}
												placeholder={'Telefon *'}
												value={formik.values.telefon2}
												onChange={(e) =>
													formik.setFieldValue('telefon2', e.target.value)
												}
												onBlur={formik.handleBlur}
												errors={formik.errors.telefon2}
												touched={formik.touched.telefon2}
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						<div>
							<h2>PROIZVODI</h2>
							<div className="seperator-line"></div>
							<OrderAddProducts />
						</div>
						<div>
							<Button
								type="submit"
								isLoading={isLoading}
								width="100%"
								text="Add new Order"
							/>
						</div>
					</form>
				</FormikProvider>
			</div>
			<Link
				to={`/orders?page=${page}&pageSize=${pageSize}${
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

export default NewOrder;
