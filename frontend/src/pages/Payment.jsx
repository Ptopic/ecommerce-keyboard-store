import React, { useState, useEffect } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import Checkout from './Checkout';

import { useSelector } from 'react-redux';
import { request } from '../api';

function Payment(props) {
	const cart = useSelector((state) => state.cart);
	const configureStripe = async () => {
		// Create PaymentIntent as soon as the page loads
		const res = await request.post('/checkout/pay', {
			amount:
				(cart.totalPrice > 20 ? cart.totalPrice : cart.totalPrice + 3) * 100,
			items: cart.products,
		});
		setClientSecret(res.data.data);
	};

	useEffect(() => {
		configureStripe();
	}, []);
	const { stripePromise } = props;
	const [clientSecret, setClientSecret] = useState('');
	return (
		<div>
			{clientSecret && stripePromise && (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<Checkout clientSecret={clientSecret} />
				</Elements>
			)}
		</div>
	);
}

export default Payment;
