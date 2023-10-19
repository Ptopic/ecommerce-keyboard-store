import React from 'react';
import './Offer.css';
function Offer() {
	return (
		<div className="offer-section">
			<p>We Offer</p>

			<div className="offer-container">
				<div className="offer-card">
					<div className="img-container">
						<img
							src="https://dangkeebs.com/cdn/shop/files/E8121F33-40A0-487A-A568-827F3C87ED31.png?v=1692028367&width=150"
							alt=""
						/>
					</div>
					<div className="header-container">
						<h3>Free Shipping</h3>
					</div>

					<div className="text-container">
						<p>For eligible domestic orders over $99.</p>
					</div>
				</div>

				<div className="offer-card">
					<div className="img-container">
						<img
							src="https://dangkeebs.com/cdn/shop/files/22BE20B4-98B8-4ADA-A4DB-855B7B67B08C.png?v=1692028320&width=150"
							alt=""
						/>
					</div>
					<div className="header-container">
						<h3>International Shipping Options</h3>
					</div>

					<div className="text-container">
						<p>We ship to most countries!</p>
					</div>
				</div>

				<div className="offer-card">
					<div className="img-container">
						<img
							src="https://dangkeebs.com/cdn/shop/files/CDA65ADD-95B8-4476-8AE2-828EC9FB4B80.png?v=1692028417&width=150"
							alt=""
						/>
					</div>
					<div className="header-container">
						<h3>30 Day Worry-free Return Policy</h3>
					</div>

					<div className="text-container">
						<p>
							Don't keep anything you're unhappy with. We simply want you to
							love your next build!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Offer;
