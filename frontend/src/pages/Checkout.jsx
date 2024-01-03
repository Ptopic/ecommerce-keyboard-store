import React, { useState, useEffect } from 'react';
import './Checkout.css';

import { IoMdCheckmark } from 'react-icons/io';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';

import { useNavigate } from 'react-router-dom';

// Redux
import { setState, resetState } from '../redux/paymentRedux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Checkout() {
	const cart = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [r1, setR1] = useState(false);
	const [dostava, setDostava] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		ime: Yup.string().required('Ime is required'),
		prezime: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
	});

	const validationSchemaWithR1 = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		tvrtka: Yup.string().required('Tvrtka is required'),
		oib: Yup.number().required('OIB is required'),
		ime: Yup.string().required('Ime is required'),
		prezime: Yup.string().required('Prezime is required'),
		mjesto: Yup.string().required('Mjesto is required'),
		zip: Yup.string().required('Zip is required'),
		adresa: Yup.string().required('Adresa is required'),
		telefon: Yup.number().required('Telefon is required'),
	});

	const validationSchemaWithDostava = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		ime: Yup.string().required('Ime is required'),
		prezime: Yup.string().required('Prezime is required'),
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
		ime: Yup.string().required('Ime is required'),
		prezime: Yup.string().required('Prezime is required'),
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
		ime: '',
		prezime: '',
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

	const goToCheckout = async (values, formikActions) => {
		setIsProcessing(true);
		// const clientSecret = res.data.data;
		// // Add data to redux state
		// console.log(stripePromise);
		// console.log(clientSecret);

		const billingDetails = {
			name: values.ime + ' ' + values.prezime,
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
				: values.ime + ' ' + values.prezime,
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
			})
		);

		setIsProcessing(false);
		// Redirect to payment page
		navigate('/payment');
	};

	return (
		<div className="checkout-container">
			<Navbar />
			<Formik
				initialValues={initialValues}
				enableReinitialize={true}
				validationSchema={
					dostava && r1
						? validationSchemaWithDostavaAndR1
						: r1
						? validationSchemaWithR1
						: dostava
						? validationSchemaWithDostava
						: validationSchema
				}
				onSubmit={(values, formikActions) =>
					goToCheckout(values, formikActions)
				}
			>
				{({ errors, touched }) => (
					<Form className="checkout-content">
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

							{/* ----- Mobile checkout forms ----- */}
							<div className="checkout-form-mobile">
								<div className="checkout-input full email">
									<Field
										type="text"
										name="email"
										placeholder="Email"
										autoCapitalize="off"
									/>
									{errors.email && touched.email ? (
										<div className="error">{errors.email}</div>
									) : null}
								</div>
								{r1 && (
									<div className="checkout-input">
										<Field type="text" name="tvrtka" placeholder="Tvrtka" />
										{errors.tvrtka && touched.tvrtka ? (
											<div className="error">{errors.tvrtka}</div>
										) : null}
									</div>
								)}
								{r1 && (
									<div className="checkout-input">
										<Field type="number" name="oib" placeholder="OIB" />
										{errors.oib && touched.oib ? (
											<div className="error">{errors.oib}</div>
										) : null}
									</div>
								)}
								<div className="checkout-input">
									<Field type="text" name="ime" placeholder="Ime" />
									{errors.ime && touched.ime ? (
										<div className="error">{errors.ime}</div>
									) : null}
								</div>

								<div className="checkout-input">
									<Field type="text" name="prezime" placeholder="Prezime" />
									{errors.prezime && touched.prezime ? (
										<div className="error">{errors.prezime}</div>
									) : null}
								</div>
								<div className="checkout-input">
									<Field type="text" name="adresa" placeholder="Adresa" />
									{errors.adresa && touched.adresa ? (
										<div className="error">{errors.adresa}</div>
									) : null}
								</div>
								<div className="checkout-input">
									<Field type="text" name="mjesto" placeholder="Mjesto" />
									{errors.mjesto && touched.mjesto ? (
										<div className="error">{errors.mjesto}</div>
									) : null}
								</div>
								<div className="checkout-input">
									<Field type="text" name="zip" placeholder="Poštanski broj" />
									{errors.zip && touched.zip ? (
										<div className="error">{errors.zip}</div>
									) : null}
								</div>
								<div className="checkout-input">
									<Field type="text" name="telefon" placeholder="Telefon" />
									{errors.telefon && touched.telefon ? (
										<div className="error">{errors.telefon}</div>
									) : null}
								</div>
							</div>

							{/* ----- Desktop checkout forms -----*/}
							<div className="checkout-form">
								<div className="checkout-input full email">
									<Field
										type="text"
										name="email"
										placeholder="Email"
										autoCapitalize="off"
									/>
									{errors.email && touched.email ? (
										<div className="error">{errors.email}</div>
									) : null}
								</div>
								<div className="checkout-form-left">
									{r1 && (
										<div className="checkout-input">
											<Field type="text" name="tvrtka" placeholder="Tvrtka" />
											{errors.tvrtka && touched.tvrtka ? (
												<div className="error">{errors.tvrtka}</div>
											) : null}
										</div>
									)}
									<div className="checkout-input">
										<Field type="text" name="ime" placeholder="Ime" />
										{errors.ime && touched.ime ? (
											<div className="error">{errors.ime}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="mjesto" placeholder="Mjesto" />
										{errors.mjesto && touched.mjesto ? (
											<div className="error">{errors.mjesto}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="adresa" placeholder="Adresa" />
										{errors.adresa && touched.adresa ? (
											<div className="error">{errors.adresa}</div>
										) : null}
									</div>
								</div>

								<div className="checkout-form-right">
									{r1 && (
										<div className="checkout-input">
											<Field type="number" name="oib" placeholder="OIB" />
											{errors.oib && touched.oib ? (
												<div className="error">{errors.oib}</div>
											) : null}
										</div>
									)}
									<div className="checkout-input">
										<Field type="text" name="prezime" placeholder="Prezime" />
										{errors.prezime && touched.prezime ? (
											<div className="error">{errors.prezime}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field
											type="text"
											name="zip"
											placeholder="Poštanski broj"
										/>
										{errors.zip && touched.zip ? (
											<div className="error">{errors.zip}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="telefon" placeholder="Telefon" />
										{errors.telefon && touched.telefon ? (
											<div className="error">{errors.telefon}</div>
										) : null}
									</div>
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
									onClick={() =>
										dostava ? setDostava(false) : setDostava(true)
									}
								>
									{dostava ? null : <IoMdCheckmark color={'white'} size={24} />}
								</button>
								<p>Podaci za dostavu jednaki su podacima za dostavu računa</p>
							</div>

							{/* ----- Mobile checkout form dostava ----- */}
							{dostava && (
								<div className="checkout-form-mobile">
									{r1 && (
										<div className="checkout-input">
											<Field type="text" name="tvrtka2" placeholder="Tvrtka" />
											{errors.tvrtka2 && touched.tvrtka2 ? (
												<div className="error">{errors.tvrtka2}</div>
											) : null}
										</div>
									)}
									<div className="checkout-input">
										<Field type="text" name="ime2" placeholder="Ime" />
										{errors.ime2 && touched.ime2 ? (
											<div className="error">{errors.ime2}</div>
										) : null}
									</div>

									<div className="checkout-input">
										<Field type="text" name="prezime2" placeholder="Prezime" />
										{errors.prezime2 && touched.prezime2 ? (
											<div className="error">{errors.prezime2}</div>
										) : null}
									</div>

									<div className="checkout-input">
										<Field type="text" name="adresa2" placeholder="Adresa" />
										{errors.adresa2 && touched.adresa2 ? (
											<div className="error">{errors.adresa2}</div>
										) : null}
									</div>

									<div className="checkout-input">
										<Field type="text" name="mjesto2" placeholder="Mjesto" />
										{errors.mjesto2 && touched.mjesto2 ? (
											<div className="error">{errors.mjesto2}</div>
										) : null}
									</div>

									<div className="checkout-input">
										<Field
											type="text"
											name="zip2"
											placeholder="Poštanski broj"
										/>
										{errors.zip2 && touched.zip2 ? (
											<div className="error">{errors.zip2}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="telefon2" placeholder="Telefon" />
										{errors.telefon2 && touched.telefon2 ? (
											<div className="error">{errors.telefon2}</div>
										) : null}
									</div>
								</div>
							)}
							{/* ----- Desktop checkout form dostava ----- */}
							{dostava && (
								<div className="checkout-form">
									<div className="checkout-form-left">
										{r1 && (
											<div className="checkout-input">
												<Field
													type="text"
													name="tvrtka2"
													placeholder="Tvrtka"
												/>
												{errors.tvrtka2 && touched.tvrtka2 ? (
													<div className="error">{errors.tvrtka2}</div>
												) : null}
											</div>
										)}
										<div className="checkout-input">
											<Field type="text" name="ime2" placeholder="Ime" />
											{errors.ime2 && touched.ime2 ? (
												<div className="error">{errors.ime2}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field type="text" name="mjesto2" placeholder="Mjesto" />
											{errors.mjesto2 && touched.mjesto2 ? (
												<div className="error">{errors.mjesto2}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field type="text" name="adresa2" placeholder="Adresa" />
											{errors.adresa2 && touched.adresa2 ? (
												<div className="error">{errors.adresa2}</div>
											) : null}
										</div>
									</div>
									<div className="checkout-form-right">
										<div className="checkout-input">
											<Field
												type="text"
												name="prezime2"
												placeholder="Prezime"
											/>
											{errors.prezime2 && touched.prezime2 ? (
												<div className="error">{errors.prezime2}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field
												type="text"
												name="zip2"
												placeholder="Poštanski broj"
											/>
											{errors.zip2 && touched.zip2 ? (
												<div className="error">{errors.zip2}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field
												type="text"
												name="telefon2"
												placeholder="Telefon"
											/>
											{errors.telefon2 && touched.telefon2 ? (
												<div className="error">{errors.telefon2}</div>
											) : null}
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="checkout-content-right">
							<h2>Tvoja nardžba:</h2>
							{cart.products.map((product, i) => (
								<div className="cart-product">
									<div className="cart-product-left">
										<img src={product.image} alt="product img" />
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
										{product.color.length > 0 && (
											<p style={{ fontSize: '1.6rem' }}>
												Color: {product.color}
											</p>
										)}
									</div>

									<div className="cart-product-right">
										<p>€{product.price * product.quantity}</p>
									</div>
								</div>
							))}
							<div className="ukupno">
								<h2>Ukupno u košarici:</h2>
								<div className="ukupno-content">
									<div className="ukupno-content-item">
										<h3>Sveukupno:</h3>
										<p>€{cart.totalPrice}</p>
									</div>
									<div className="ukupno-content-item">
										<h3 className="ukupno-dostava">Dostava:</h3>
										<p className="ukupno-dostava">
											{cart.totalPrice > 20 ? 'Besplatna' : '€3,00'}
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
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default Checkout;
