import React, { useState, useEffect } from 'react';
import './Checkout.css';

import { IoMdCheckmark } from 'react-icons/io';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';

import { useNavigate } from 'react-router-dom';

// Redux
import { setState, resetState } from '../redux/paymentRedux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

// Utils
import { formatPriceDisplay } from '../utils/formatting';

function Checkout() {
	let user = useSelector((state) => state.user.currentUser);
	user = user.data;

	const cart = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [r1, setR1] = useState(
		user != null && user.tvrtka !== '' ? true : false
	);
	const [dostava, setDostava] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

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
		email: user != null && user.email ? user.email : '',
		tvrtka: user != null && user.tvrtka ? user.tvrtka : '',
		oib: user != null && user.oib ? user.oib : '',
		firstName: user != null && user.firstName ? user.firstName : '',
		lastName: user != null && user.lastName ? user.lastName : '',
		mjesto:
			user != null && user.billingInfo != null
				? user.billingInfo.address.city
				: '',
		zip:
			user != null && user.billingInfo != null
				? user.billingInfo.address.postal_code
				: '',
		adresa:
			user != null && user.billingInfo != null
				? user.billingInfo.address.line1
				: '',
		telefon:
			user != null && user.billingInfo != null ? user.billingInfo.phone : '',
		// Additional shipping info
		tvrtka2: user != null && user.tvrtkaDostava ? user.tvrtkaDostava : '',
		ime2:
			user != null && user.shippingInfo != null
				? user.shippingInfo.firstName
				: '',
		prezime2:
			user != null && user.shippingInfo != null
				? user.shippingInfo.lastName
				: '',
		mjesto2:
			user != null && user.shippingInfo != null
				? user.shippingInfo.address.city
				: '',
		zip2:
			user != null && user.shippingInfo != null
				? user.shippingInfo.address.postal_code
				: '',
		adresa2:
			user != null && user.shippingInfo != null
				? user.shippingInfo.address.line1
				: '',
		telefon2:
			user != null && user.shippingInfo != null ? user.shippingInfo.phone : '',
	};

	const goToCheckout = async (values, formikActions) => {
		setIsProcessing(true);

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

		dispatch(
			setState({
				billingDetails: billingDetails,
				shippingDetails: shippingDetails,
				tvrtka: tvrtka,
				tvrtkaDostava: tvrtkaDostava,
				oib: oib,
				dostava: dostava,
				userId: user != null ? user._id : '',
			})
		);

		setIsProcessing(false);
		// Redirect to payment page
		navigate('/payment');
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
			goToCheckout(values, formikActions);
		},
	});

	return (
		<div className="checkout-container">
			<Navbar />
			<FormikProvider value={formik}>
				<form className="checkout-content" onSubmit={formik.handleSubmit}>
					<div className="checkout-content-left">
						<h2>PODACI ZA DOSTAVU RAČUNA</h2>
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
								onChange={(e) => formik.setFieldValue('email', e.target.value)}
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
								onChange={(e) => formik.setFieldValue('adresa', e.target.value)}
								onBlur={formik.handleBlur}
								errors={formik.errors.adresa}
								touched={formik.touched.adresa}
							/>
							<InputField
								type={'text'}
								name={'mjesto'}
								placeholder={'Mjesto *'}
								value={formik.values.mjesto}
								onChange={(e) => formik.setFieldValue('mjesto', e.target.value)}
								onBlur={formik.handleBlur}
								errors={formik.errors.mjesto}
								touched={formik.touched.mjesto}
							/>
							<InputField
								type={'text'}
								name={'zip'}
								placeholder={'Poštanski broj *'}
								value={formik.values.zip}
								onChange={(e) => formik.setFieldValue('zip', e.target.value)}
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
								onChange={(e) => formik.setFieldValue('email', e.target.value)}
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
									onChange={(e) => formik.setFieldValue('zip', e.target.value)}
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
						<div className="checkout-checkbox">
							<button
								type="button"
								style={{
									background: dostava ? '#fff' : '#E81123',
									border: dostava ? '1px solid black' : 'none',
								}}
								onClick={() => (dostava ? setDostava(false) : setDostava(true))}
							>
								{dostava ? null : <IoMdCheckmark color={'white'} size={24} />}
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
									onChange={(e) => formik.setFieldValue('ime2', e.target.value)}
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
									onChange={(e) => formik.setFieldValue('zip2', e.target.value)}
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

					<div className="checkout-content-right">
						<h2>Tvoja nardžba:</h2>
						{cart.products.map((product, i) => (
							<div className="cart-product">
								<div className="cart-product-left">
									<img src={product.images[0].url} alt="product img" />
								</div>
								<div className="cart-product-center">
									<div
										to={`/product/${product._id}`}
										className="cart-product-title"
										onClick={() => continueShopping()}
									>
										{product.title}
									</div>
									<p className="cart-product-price">{product.quantity} kom</p>
									{/* {product.color.length > 0 && (
											<p style={{ fontSize: '1.6rem' }}>
												Color: {product.color}
											</p>
										)} */}
								</div>

								<div className="cart-product-right">
									<p>€{formatPriceDisplay(product.price * product.quantity)}</p>
								</div>
							</div>
						))}
						<div className="ukupno">
							<h2>Ukupno u košarici:</h2>
							<div className="ukupno-content">
								<div className="ukupno-content-item">
									<h3>Sveukupno:</h3>
									<p>€{formatPriceDisplay(cart.totalPrice)}</p>
								</div>
								<div className="ukupno-content-item">
									<h3 className="ukupno-dostava">Dostava:</h3>
									<p className="ukupno-dostava">
										{cart.totalPrice > 40 ? 'Besplatna' : '€3,00'}
									</p>
								</div>
							</div>
							<Button
								type="submit"
								text={'Idi na plačanje'}
								isLoading={isProcessing}
								width={'100%'}
							/>
						</div>
					</div>
				</form>
			</FormikProvider>
		</div>
	);
}

export default Checkout;
