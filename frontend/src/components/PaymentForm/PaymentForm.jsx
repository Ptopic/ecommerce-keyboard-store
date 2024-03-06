import React, { useState, useEffect } from 'react';
import '../../pages/Checkout/Checkout.css';

import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { toast, Toaster } from 'react-hot-toast';

// Components
import Navbar from '../Navbar/Navbar';
import Button from '../Button/Button';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';

function PaymentForm() {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const cart = useSelector((state) => state.cart);
	const paymentInfo = useSelector((state) => state.payment);

	const sendPayment = async () => {
		setIsProcessing(true);
		// Make payment
		console.log(paymentInfo);
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${import.meta.env.VITE_APP_URL}/success`,
				payment_method_data: {
					billing_details: {
						...paymentInfo.billingDetails,
					},
				},
				shipping: {
					...paymentInfo.shippingDetails,
				},
			},
		});

		setIsProcessing(false);
		if (error) {
			// Display error message to user
			toast.error(error.message);
		} else {
			formikActions.resetForm();
		}
	};

	return (
		<div className="checkout-container">
			<Navbar />
			<Toaster />

			<div className="checkout-content">
				<div className="checkout-content-left">
					<h2 style={{ paddingBottom: '30px' }}>PLAČANJE RAČUNA</h2>

					<PaymentElement id="payment-element" />
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
									{cart.totalPrice > 20 ? 'Besplatna' : '€3,00'}
								</p>
							</div>
						</div>
						<Button
							onClickFunction={sendPayment}
							text={`Plati ${
								cart.totalPrice > 40
									? formatPriceDisplay(cart.totalPrice)
									: formatPriceDisplay(cart.totalPrice + 3)
							}€`}
							isLoading={isProcessing}
							width={'100%'}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PaymentForm;
