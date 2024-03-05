import React from 'react';

//Styles
import './UserRegisterThanks.css';

// Components
import Navbar from '../../components/Navbar/Navbar';

// Lottie animations
import Lottie from 'lottie-react';
import paymentSuccessAnimation from '../../assets/lottie/payment.json';

import { Link } from 'react-router-dom';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function UserRegisterThanks() {
	return (
		<div>
			<Navbar />
			<div className="success-container">
				<Lottie
					animationData={paymentSuccessAnimation}
					loop={false}
					className="payment-animation"
				/>

				<div className="registration-success-container">
					<h1>Thank you for registering</h1>

					<div className="registration-success-container-btns">
						<Link to="/user/details" className="btn left">
							<FaChevronLeft />
							Edit your profile
						</Link>

						<Link to="/" className="btn right">
							<FaChevronRight />
							Continue shopping
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserRegisterThanks;
