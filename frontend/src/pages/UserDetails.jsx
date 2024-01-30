import React, { useState, useEffect } from 'react';

import './UserDetails.css';
import '../pages/Checkout.css';

import { IoMdCheckmark } from 'react-icons/io';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Redux
import { setUserData } from '../redux/userRedux';
import { useSelector, useDispatch } from 'react-redux';
import { userRequest } from '../api';

import { toast, Toaster } from 'react-hot-toast';

function UserDetails() {
	const dispatch = useDispatch();
	let user = useSelector((state) => state.user.currentUser);
	user = user.data;

	const [r1, setR1] = useState(user.tvrtka !== '' ? true : false);
	const [dostava, setDostava] = useState(user.ime2 !== '' ? true : false);
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
		mjesto: user.billingInfo != null ? user.billingInfo.address.city : '',
		zip: user.billingInfo != null ? user.billingInfo.address.postal_code : '',
		adresa: user.billingInfo != null ? user.billingInfo.address.line1 : '',
		telefon: user.billingInfo != null ? user.billingInfo.phone : '',
		// Additional shipping info
		tvrtka2: user.tvrtkaDostava ? user.tvrtkaDostava : '',
		ime2: user.shippingInfo != null ? user.shippingInfo.firstName : '',
		prezime2: user.shippingInfo != null ? user.shippingInfo.lastName : '',
		mjesto2: user.shippingInfo != null ? user.shippingInfo.address.city : '',
		zip2:
			user.shippingInfo != null ? user.shippingInfo.address.postal_code : '',
		adresa2: user.shippingInfo != null ? user.shippingInfo.address.line1 : '',
		telefon2: user.shippingInfo != null ? user.shippingInfo.phone : '',
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
			firstName: dostava ? values.ime2 : values.firstName,
			lastName: dostava ? values.prezime2 : values.lastName,
			fullName: dostava
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

		// Api call to update users info
		try {
			const res = await userRequest.put('/user/changeUserInfo', {
				userId: user._id,
				...values,
				shippingInfo,
				billingInfo,
				tvrtka,
				tvrtkaDostava,
				oib,
			});
			toast.success('Your info was succesfully updated!');

			// Change redux state data of user
			dispatch(setUserData(res.data.data));

			setIsProcessing(false);
		} catch (error) {
			toast.error(error.response.data.error);
			setIsProcessing(false);
		}
	};

	return (
		<div className="user-details">
			<Toaster />
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
					enableReinitialize
					initialValues={initialValues}
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
					{({ errors, touched, values, setFieldValue }) => (
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

								{/* ----- Mobile details forms ----- */}
								<div className="checkout-form-mobile">
									<InputField
										type={'text'}
										name={'email'}
										placeholder={'Email *'}
										value={values.email}
										onChange={(e) => setFieldValue('email', e.target.value)}
										errors={errors.email}
										touched={touched.email}
									/>
									{r1 && (
										<>
											<InputField
												type={'text'}
												name={'tvrtka'}
												placeholder={'Tvrtka *'}
												value={values.tvrtka}
												onChange={(e) =>
													setFieldValue('tvrtka', e.target.value)
												}
												errors={errors.tvrtka}
												touched={touched.tvrtka}
											/>
										</>
									)}
									{r1 && (
										<>
											<InputField
												type={'number'}
												name={'oib'}
												placeholder={'OIB *'}
												value={values.oib}
												onChange={(e) => setFieldValue('oib', e.target.value)}
												errors={errors.oib}
												touched={touched.oib}
											/>
										</>
									)}
									<InputField
										type={'text'}
										name={'firstName'}
										placeholder={'First Name *'}
										value={values.firstName}
										onChange={(e) => setFieldValue('firstName', e.target.value)}
										errors={errors.firstName}
										touched={touched.firstName}
									/>
									<InputField
										type={'text'}
										name={'lastName'}
										placeholder={'Last Name *'}
										value={values.lastName}
										onChange={(e) => setFieldValue('lastName', e.target.value)}
										errors={errors.lastName}
										touched={touched.lastName}
									/>
									<InputField
										type={'text'}
										name={'adresa'}
										placeholder={'Adresa *'}
										value={values.adresa}
										onChange={(e) => setFieldValue('adresa', e.target.value)}
										errors={errors.adresa}
										touched={touched.adresa}
									/>
									<InputField
										type={'text'}
										name={'mjesto'}
										placeholder={'Mjesto *'}
										value={values.mjesto}
										onChange={(e) => setFieldValue('mjesto', e.target.value)}
										errors={errors.mjesto}
										touched={touched.mjesto}
									/>
									<InputField
										type={'text'}
										name={'zip'}
										placeholder={'Poštanski broj *'}
										value={values.zip}
										onChange={(e) => setFieldValue('zip', e.target.value)}
										errors={errors.zip}
										touched={touched.zip}
									/>
									<InputField
										type={'text'}
										name={'telefon'}
										placeholder={'Telefon *'}
										value={values.telefon}
										onChange={(e) => setFieldValue('telefon', e.target.value)}
										errors={errors.telefon}
										touched={touched.telefon}
									/>
								</div>

								{/* ----- Desktop details forms -----*/}
								<div className="checkout-form">
									<InputField
										type={'text'}
										name={'email'}
										placeholder={'Email *'}
										value={values.email}
										onChange={(e) => setFieldValue('email', e.target.value)}
										errors={errors.email}
										touched={touched.email}
										fullWidth={true}
									/>
									<div className="checkout-form-left">
										{r1 && (
											<>
												<InputField
													type={'text'}
													name={'tvrtka'}
													placeholder={'Tvrtka *'}
													value={values.tvrtka}
													onChange={(e) =>
														setFieldValue('tvrtka', e.target.value)
													}
													errors={errors.tvrtka}
													touched={touched.tvrtka}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'firstName'}
											placeholder={'First Name *'}
											value={values.firstName}
											onChange={(e) =>
												setFieldValue('firstName', e.target.value)
											}
											errors={errors.firstName}
											touched={touched.firstName}
										/>
										<InputField
											type={'text'}
											name={'mjesto'}
											placeholder={'Mjesto *'}
											value={values.mjesto}
											onChange={(e) => setFieldValue('mjesto', e.target.value)}
											errors={errors.mjesto}
											touched={touched.mjesto}
										/>
										<InputField
											type={'text'}
											name={'adresa'}
											placeholder={'Adresa *'}
											value={values.adresa}
											onChange={(e) => setFieldValue('adresa', e.target.value)}
											errors={errors.adresa}
											touched={touched.adresa}
										/>
									</div>

									<div className="checkout-form-right">
										{r1 && (
											<>
												<InputField
													type={'number'}
													name={'oib'}
													placeholder={'OIB *'}
													value={values.oib}
													onChange={(e) => setFieldValue('oib', e.target.value)}
													errors={errors.oib}
													touched={touched.oib}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'lastName'}
											placeholder={'Prezime *'}
											value={values.lastName}
											onChange={(e) =>
												setFieldValue('lastName', e.target.value)
											}
											errors={errors.lastName}
											touched={touched.lastName}
										/>
										<InputField
											type={'number'}
											name={'zip'}
											placeholder={'Poštanski broj *'}
											value={values.zip}
											onChange={(e) => setFieldValue('zip', e.target.value)}
											errors={errors.zip}
											touched={touched.zip}
										/>
										<InputField
											type={'text'}
											name={'telefon'}
											placeholder={'Telefon *'}
											value={values.telefon}
											onChange={(e) => setFieldValue('telefon', e.target.value)}
											errors={errors.telefon}
											touched={touched.telefon}
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
													value={values.tvrtka2}
													onChange={(e) =>
														setFieldValue('tvrtka2', e.target.value)
													}
													errors={errors.tvrtka2}
													touched={touched.tvrtka2}
												/>
											</>
										)}
										<InputField
											type={'text'}
											name={'ime2'}
											placeholder={'Ime *'}
											value={values.ime2}
											onChange={(e) => setFieldValue('ime2', e.target.value)}
											errors={errors.ime2}
											touched={touched.ime2}
										/>

										<InputField
											type={'text'}
											name={'prezime2'}
											placeholder={'Prezime *'}
											value={values.prezime2}
											onChange={(e) =>
												setFieldValue('prezime2', e.target.value)
											}
											errors={errors.prezime2}
											touched={touched.prezime2}
										/>

										<InputField
											type={'text'}
											name={'adresa2'}
											placeholder={'Adresa *'}
											value={values.adresa2}
											onChange={(e) => setFieldValue('adresa2', e.target.value)}
											errors={errors.adresa2}
											touched={touched.adresa2}
										/>

										<InputField
											type={'text'}
											name={'mjesto2'}
											placeholder={'Mjesto *'}
											value={values.mjesto2}
											onChange={(e) => setFieldValue('mjesto2', e.target.value)}
											errors={errors.mjesto2}
											touched={touched.mjesto2}
										/>

										<InputField
											type={'text'}
											name={'zip2'}
											placeholder={'Poštanski broj *'}
											value={values.zip2}
											onChange={(e) => setFieldValue('zip2', e.target.value)}
											errors={errors.zip2}
											touched={touched.zip2}
										/>

										<InputField
											type={'text'}
											name={'telefon2'}
											placeholder={'Telefon *'}
											value={values.telefon2}
											onChange={(e) =>
												setFieldValue('telefon2', e.target.value)
											}
											errors={errors.telefon2}
											touched={touched.telefon2}
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
													value={values.tvrtka2}
													onChange={(e) =>
														setFieldValue('tvrtka2', e.target.value)
													}
													errors={errors.tvrtka2}
													touched={touched.tvrtka2}
													fullWidth={true}
												/>
											</>
										)}
										<div className="checkout-form-left">
											<InputField
												type={'text'}
												name={'ime2'}
												placeholder={'Ime *'}
												value={values.ime2}
												onChange={(e) => setFieldValue('ime2', e.target.value)}
												errors={errors.ime2}
												touched={touched.ime2}
											/>
											<InputField
												type={'text'}
												name={'mjesto2'}
												placeholder={'Mjesto *'}
												value={values.mjesto2}
												onChange={(e) =>
													setFieldValue('mjesto2', e.target.value)
												}
												errors={errors.mjesto2}
												touched={touched.mjesto2}
											/>
											<InputField
												type={'text'}
												name={'adresa2'}
												placeholder={'Adresa *'}
												value={values.adresa2}
												onChange={(e) =>
													setFieldValue('adresa2', e.target.value)
												}
												errors={errors.adresa2}
												touched={touched.adresa2}
											/>
										</div>
										<div className="checkout-form-right">
											<InputField
												type={'text'}
												name={'prezime2'}
												placeholder={'Prezime *'}
												value={values.prezime2}
												onChange={(e) =>
													setFieldValue('prezime2', e.target.value)
												}
												errors={errors.prezime2}
												touched={touched.prezime2}
											/>
											<InputField
												type={'text'}
												name={'zip2'}
												placeholder={'Poštanski broj *'}
												value={values.zip2}
												onChange={(e) => setFieldValue('zip2', e.target.value)}
												errors={errors.zip2}
												touched={touched.zip2}
											/>
											<InputField
												type={'text'}
												name={'telefon2'}
												placeholder={'Telefon *'}
												value={values.telefon2}
												onChange={(e) =>
													setFieldValue('telefon2', e.target.value)
												}
												errors={errors.telefon2}
												touched={touched.telefon2}
											/>
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
