import React from 'react';
import './Footer.css';
import { BsFacebook, BsInstagram } from 'react-icons/bs';
import apple from '../../assets/payments/apple-pay.svg';
import google from '../../assets/payments/google-pay.svg';
import paypal from '../../assets/payments/paypal.svg';
import mastercard from '../../assets/payments/mastercard.png';
import visa from '../../assets/payments/visa.png';
function Footer() {
	return (
		<div className="footer">
			<div className="footer-info">
				<div className="footer-left">
					<p>Info:</p>
					<div>
						<a href="">About Us</a>
						<br></br>
						<a href="">Help Center</a>
						<br></br>
						<a href="">Updated</a>
						<br></br>
						<a href="">Affiliate Program</a>
						<br></br>
						<a href="">Shipping Policy</a>
						<br></br>
						<a href="">Return Policy</a>
						<br></br>
						<a href="">Privacy Policy</a>
						<br></br>
						<a href="">Terms & Conditions</a>
						<br></br>
						<a href="">Terms of Service</a>
					</div>
				</div>
				<div className="footer-center">
					<p>Contact:</p>
					<div>
						<a href="">Email</a>
						<br></br>
						<a href="">Facebook</a>
						<br></br>
						<a href="">Instagram</a>
					</div>
				</div>
				<div className="footer-right">
					<p>Hours of Operation:</p>
					<div className="footer-hours">
						<div>
							<span style={{ fontWeight: 'bold' }}>Monday - Friday: </span>
							<p style={{ fontSize: '1.4rem' }}>10AM - 6PM</p>
						</div>
						<div>
							<span style={{ fontWeight: 'bold' }}>Weekends:</span>
							<p style={{ fontSize: '1.4rem' }}>Closed</p>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-contact">
				<div>
					<p>Stay updated for our future product lines.</p>
				</div>
				<div className="footer-social">
					<BsFacebook />
					<BsInstagram />
				</div>
			</div>
			<div className="footer-payment">
				<div className="payment-methods">
					<img src={apple} alt="" />
					<img src={google} alt="" />
					<img src={paypal} alt="" />
					<img src={mastercard} alt="" />
					<img src={visa} alt="" />
				</div>
			</div>
			<div className="footer-copyright">
				<p>&copy; {new Date().getFullYear()}, Switchy All Rights Reserved</p>
			</div>
		</div>
	);
}

export default Footer;
