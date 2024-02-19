import React, { useState, useEffect } from 'react';
import './Checkout.css';

import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

import { request } from '../api';

// Redux
import { useSelector } from 'react-redux';

function Payment(props) {
	const paymentInfo = useSelector((state) => state.payment);
	const cart = useSelector((state) => state.cart);
	const { stripePromise } = props;
	const [clientSecret, setClientSecret] = useState(null);

	const configureStripe = async () => {
		// Add all form data to metadata of payment
		let priceTo2DecimalPlaces = parseFloat(
			cart.totalPrice > 40 ? cart.totalPrice : cart.totalPrice + 3
		).toFixed(2);
		const res = await request.post('/checkout/pay', {
			amount: priceTo2DecimalPlaces * 100,
			items: cart.products,
			tvrtka: paymentInfo.tvrtka,
			tvrtkaDostava: paymentInfo.tvrtkaDostava,
			oib: paymentInfo.oib,
			userId: paymentInfo.userId,
		});

		setClientSecret(res.data.data);
	};
	useEffect(() => {
		configureStripe();
	}, []);

	return (
		<div>
			{clientSecret && stripePromise && (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<PaymentForm />
				</Elements>
			)}
		</div>
	);
}

export default Payment;
