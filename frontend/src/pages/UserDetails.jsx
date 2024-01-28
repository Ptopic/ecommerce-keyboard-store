import React, { useState, useEffect } from 'react';

import './UserDetails.css';
import '../pages/Checkout.css';

import { IoMdCheckmark } from 'react-icons/io';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Redux
import { setUserData } from '../redux/userRedux';
import { useSelector, useDispatch } from 'react-redux';
import { userRequest } from '../api';

function UserDetails() {
	const dispatch = useDispatch();
	let user = useSelector((state) => state.user.currentUser);
	user = user.data;

	const [r1, setR1] = useState(user.tvrtka !== '' ? true : false);
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
		email: user.email ? user.email : '',
		tvrtka: user.tvrtka ? user.tvrtka : '',
		oib: user.oib ? user.oib : '',
		firstName: user.firstName ? user.firstName : '',
		lastName: user.lastName ? user.lastName : '',
		mjesto: user.billingInfo.address.city ? user.billingInfo.address.city : '',
		zip: user.billingInfo.address.postal_code
			? user.billingInfo.address.postal_code
			: '',
		adresa: user.billingInfo.address.line1
			? user.billingInfo.address.line1
			: '',
		telefon: user.billingInfo.phone ? user.billingInfo.phone : '',
		// Additional shipping info
		tvrtka2: user.tvrtkaDostava ? user.tvrtkaDostava : '',
		ime2: user.shippingInfo.firstName ? user.shippingInfo.firstName : '',
		prezime2: user.shippingInfo.lastName ? user.shippingInfo.lastName : '',
		mjesto2: user.shippingInfo.address.city
			? user.shippingInfo.address.city
			: '',
		zip2: user.shippingInfo.address.postal_code
			? user.shippingInfo.address.postal_code
			: '',
		adresa2: user.shippingInfo.address.line1
			? user.shippingInfo.address.line1
			: '',
		telefon2: user.shippingInfo.phone ? user.shippingInfo.phone : '',
	};

	const editUserInfo = async (values, formikActions) => {
		setIsProcessing(true);

		// Set users shipping and billing info
		const billingInfo = {
			firstName: values.firstName,
			lastName: values.lastName,
			fullName: values.firstName + ' ' + values.lastName,
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

		const shippingInfo = {
			firstName: dostava ? values.ime2 : values.ime,
			lastName: dostava ? values.prezime2 : values.prezime,
			fullName: dostava
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

		console.log(values);

		// Api call to update users info
		const res = await userRequest.put('/user/changeUserInfo', {
			userId: user._id,
			...values,
			shippingInfo,
			billingInfo,
			tvrtka,
			tvrtkaDostava,
			oib,
		});

		// Change redux state data of user
		dispatch(setUserData(res.data.data));

		console.log(res);

		setIsProcessing(false);
	};

	return (
		<div className="user-details">
			<Navbar />

			<div className="user-details-container">
				<div className="user-sidebar">
					<Link className="active" to={'/user/details'}>
						Korisnički podaci
					</Link>

					<Link to={'/user/orders'}>Pregled narudžbi</Link>

					<Link to={'/user/changePassword'}>Promjena lozinke</Link>
				</div>

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
						editUserInfo(values, formikActions)
					}
				>
					{({ errors, touched }) => (
						<Form className="user-content">
							<div className="user-content-left">
								<h1>Korisnički podaci</h1>
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
											placeholder="Email *"
											autoCapitalize="off"
										/>
										{errors.email && touched.email ? (
											<div className="error">{errors.email}</div>
										) : null}
									</div>
									{r1 && (
										<div className="checkout-input">
											<Field type="text" name="tvrtka" placeholder="Tvrtka *" />
											{errors.tvrtka && touched.tvrtka ? (
												<div className="error">{errors.tvrtka}</div>
											) : null}
										</div>
									)}
									{r1 && (
										<div className="checkout-input">
											<Field type="number" name="oib" placeholder="OIB *" />
											{errors.oib && touched.oib ? (
												<div className="error">{errors.oib}</div>
											) : null}
										</div>
									)}
									<div className="checkout-input">
										<Field type="text" name="firstName" placeholder="Ime *" />
										{errors.firstName && touched.firstName ? (
											<div className="error">{errors.firstName}</div>
										) : null}
									</div>

									<div className="checkout-input">
										<Field
											type="text"
											name="lastName"
											placeholder="Prezime *"
										/>
										{errors.lastName && touched.lastName ? (
											<div className="error">{errors.lastName}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="adresa" placeholder="Adresa *" />
										{errors.adresa && touched.adresa ? (
											<div className="error">{errors.adresa}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="mjesto" placeholder="Mjesto *" />
										{errors.mjesto && touched.mjesto ? (
											<div className="error">{errors.mjesto}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field
											type="text"
											name="zip"
											placeholder="Poštanski broj *"
										/>
										{errors.zip && touched.zip ? (
											<div className="error">{errors.zip}</div>
										) : null}
									</div>
									<div className="checkout-input">
										<Field type="text" name="telefon" placeholder="Telefon *" />
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
											placeholder="Email *"
											autoCapitalize="off"
										/>
										{errors.email && touched.email ? (
											<div className="error">{errors.email}</div>
										) : null}
									</div>
									<div className="checkout-form-left">
										{r1 && (
											<div className="checkout-input">
												<Field
													type="text"
													name="tvrtka"
													placeholder="Tvrtka *"
												/>
												{errors.tvrtka && touched.tvrtka ? (
													<div className="error">{errors.tvrtka}</div>
												) : null}
											</div>
										)}
										<div className="checkout-input">
											<Field type="text" name="firstName" placeholder="Ime *" />
											{errors.firstName && touched.firstName ? (
												<div className="error">{errors.firstName}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field type="text" name="mjesto" placeholder="Mjesto *" />
											{errors.mjesto && touched.mjesto ? (
												<div className="error">{errors.mjesto}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field type="text" name="adresa" placeholder="Adresa *" />
											{errors.adresa && touched.adresa ? (
												<div className="error">{errors.adresa}</div>
											) : null}
										</div>
									</div>

									<div className="checkout-form-right">
										{r1 && (
											<div className="checkout-input">
												<Field type="number" name="oib" placeholder="OIB *" />
												{errors.oib && touched.oib ? (
													<div className="error">{errors.oib}</div>
												) : null}
											</div>
										)}
										<div className="checkout-input">
											<Field
												type="text"
												name="lastName"
												placeholder="Prezime *"
											/>
											{errors.lastName && touched.lastName ? (
												<div className="error">{errors.lastName}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field
												type="text"
												name="zip"
												placeholder="Poštanski broj *"
											/>
											{errors.zip && touched.zip ? (
												<div className="error">{errors.zip}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field
												type="text"
												name="telefon"
												placeholder="Telefon *"
											/>
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
										{dostava ? null : (
											<IoMdCheckmark color={'white'} size={24} />
										)}
									</button>
									<p>Podaci za dostavu jednaki su podacima za dostavu računa</p>
								</div>

								{/* ----- Mobile checkout form dostava ----- */}
								{dostava && (
									<div className="checkout-form-mobile">
										{r1 && (
											<div className="checkout-input">
												<Field
													type="text"
													name="tvrtka2"
													placeholder="Tvrtka *"
												/>
												{errors.tvrtka2 && touched.tvrtka2 ? (
													<div className="error">{errors.tvrtka2}</div>
												) : null}
											</div>
										)}
										<div className="checkout-input">
											<Field type="text" name="ime2" placeholder="Ime *" />
											{errors.ime2 && touched.ime2 ? (
												<div className="error">{errors.ime2}</div>
											) : null}
										</div>

										<div className="checkout-input">
											<Field
												type="text"
												name="prezime2"
												placeholder="Prezime *"
											/>
											{errors.prezime2 && touched.prezime2 ? (
												<div className="error">{errors.prezime2}</div>
											) : null}
										</div>

										<div className="checkout-input">
											<Field
												type="text"
												name="adresa2"
												placeholder="Adresa *"
											/>
											{errors.adresa2 && touched.adresa2 ? (
												<div className="error">{errors.adresa2}</div>
											) : null}
										</div>

										<div className="checkout-input">
											<Field
												type="text"
												name="mjesto2"
												placeholder="Mjesto *"
											/>
											{errors.mjesto2 && touched.mjesto2 ? (
												<div className="error">{errors.mjesto2}</div>
											) : null}
										</div>

										<div className="checkout-input">
											<Field
												type="text"
												name="zip2"
												placeholder="Poštanski broj *"
											/>
											{errors.zip2 && touched.zip2 ? (
												<div className="error">{errors.zip2}</div>
											) : null}
										</div>
										<div className="checkout-input">
											<Field
												type="text"
												name="telefon2"
												placeholder="Telefon *"
											/>
											{errors.telefon2 && touched.telefon2 ? (
												<div className="error">{errors.telefon2}</div>
											) : null}
										</div>
									</div>
								)}
								{/* ----- Desktop checkout form dostava ----- */}
								{dostava && (
									<div className="checkout-form">
										{r1 && (
											<div className="checkout-input full email">
												<Field
													type="text"
													name="tvrtka2"
													placeholder="Tvrtka *"
												/>
												{errors.tvrtka2 && touched.tvrtka2 ? (
													<div className="error">{errors.tvrtka2}</div>
												) : null}
											</div>
										)}
										<div className="checkout-form-left">
											<div className="checkout-input">
												<Field type="text" name="ime2" placeholder="Ime *" />
												{errors.ime2 && touched.ime2 ? (
													<div className="error">{errors.ime2}</div>
												) : null}
											</div>
											<div className="checkout-input">
												<Field
													type="text"
													name="mjesto2"
													placeholder="Mjesto *"
												/>
												{errors.mjesto2 && touched.mjesto2 ? (
													<div className="error">{errors.mjesto2}</div>
												) : null}
											</div>
											<div className="checkout-input">
												<Field
													type="text"
													name="adresa2"
													placeholder="Adresa *"
												/>
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
													placeholder="Prezime *"
												/>
												{errors.prezime2 && touched.prezime2 ? (
													<div className="error">{errors.prezime2}</div>
												) : null}
											</div>
											<div className="checkout-input">
												<Field
													type="text"
													name="zip2"
													placeholder="Poštanski broj *"
												/>
												{errors.zip2 && touched.zip2 ? (
													<div className="error">{errors.zip2}</div>
												) : null}
											</div>
											<div className="checkout-input">
												<Field
													type="text"
													name="telefon2"
													placeholder="Telefon *"
												/>
												{errors.telefon2 && touched.telefon2 ? (
													<div className="error">{errors.telefon2}</div>
												) : null}
											</div>
										</div>
									</div>
								)}
								<Button
									type="submit"
									text={'Spremi podatke'}
									isLoading={isProcessing}
								/>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default UserDetails;
