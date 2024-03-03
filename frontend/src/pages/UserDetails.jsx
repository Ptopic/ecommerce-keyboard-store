import React, { useState, useEffect } from 'react';

import './UserDetails.css';
import '../pages/Checkout.css';

import { IoMdCheckmark } from 'react-icons/io';

// Formik
import { Formik, Form, Field, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

// Components
import Navbar from '../components/Navbar/Navbar';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Redux
import { setUserData } from '../redux/userRedux';
import { useSelector, useDispatch } from 'react-redux';
import { user_request, userRequest } from '../api';

import { toast, Toaster } from 'react-hot-toast';

function UserDetails() {
	const dispatch = useDispatch();
	let user = useSelector((state) => state.user.currentUser);

	const [r1, setR1] = useState(user?.tvrtka !== '' ? true : false);
	const [dostava, setDostava] = useState(user?.ime2 !== '' ? true : false);
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
		email: user?.email ? user.email : '',
		tvrtka: user?.tvrtka ? user.tvrtka : '',
		oib: user?.oib ? user.oib : '',
		firstName: user?.firstName ? user.firstName : '',
		lastName: user?.lastName ? user.lastName : '',
		mjesto: user?.billingInfo != null ? user.billingInfo.address.city : '',
		zip: user?.billingInfo != null ? user.billingInfo.address.postal_code : '',
		adresa: user?.billingInfo != null ? user.billingInfo.address.line1 : '',
		telefon: user?.billingInfo != null ? user.billingInfo.phone : '',
		// Additional shipping info
		tvrtka2: user?.tvrtkaDostava ? user.tvrtkaDostava : '',
		ime2: user?.shippingInfo != null ? user.shippingInfo.firstName : '',
		prezime2: user?.shippingInfo != null ? user.shippingInfo.lastName : '',
		mjesto2: user?.shippingInfo != null ? user.shippingInfo.address.city : '',
		zip2:
			user?.shippingInfo != null ? user.shippingInfo.address.postal_code : '',
		adresa2: user?.shippingInfo != null ? user.shippingInfo.address.line1 : '',
		telefon2: user?.shippingInfo != null ? user.shippingInfo.phone : '',
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
			console.log(error);
			toast.error(error.response.data.error);
			setIsProcessing(false);
		}
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
			editUserInfo(values, formikActions);
		},
	});

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

				<FormikProvider value={formik}>
					<form className="user-content" onSubmit={formik.handleSubmit}>
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
							<Button
								type="submit"
								text={'Spremi podatke'}
								isLoading={isProcessing}
							/>
						</div>
					</form>
				</FormikProvider>
			</div>
		</div>
	);
}

export default UserDetails;
