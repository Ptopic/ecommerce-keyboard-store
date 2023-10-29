import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';

// Lottie animations
import Lottie from 'lottie-react';
import paymentSuccessAnimation from '../assets/lottie/payment.json';

import { Link } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { resetCart } from '../redux/cartRedux';

import './Success.css';
function Success() {
	const dispatch = useDispatch();
	useEffect(() => {
		// Reset cart
		dispatch(resetCart());
	}, []);
	return (
		<div>
			<Navbar />
			<div className="success-container">
				<Lottie
					animationData={paymentSuccessAnimation}
					loop={false}
					className="payment-animation"
				/>
				<div className="success-content">
					<h1>Payment Successful!</h1>
					<p>The payment has been done successfully.</p>
					<p>Thank you for shoping with us. 😊</p>

					<Link to="/" className="btn">
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Success;
