import React from 'react';
import './Featured.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

// Images
import newArrivalsImage from '../../assets/new-arrivals.png';
function Featured() {
	return (
		<div className="featured-section">
			<p>Featured Collections</p>

			<div className="featured-container">
				<Link to="/products/all" className="featured-card">
					<img src={newArrivalsImage} alt="" />
					<div>
						<span>New Arrivals</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/best?name=Best+Sellers" className="featured-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/DSC01728.jpg?v=1678141076&width=330"
						alt=""
					/>
					<div>
						<span>Best Sellers</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/keyboard?name=Keyboards" className="featured-card">
					<img
						src="https://dangkeebs.com/cdn/shop/files/IglooCover_2.jpg?v=1692060598&width=823,https://dangkeebs.com/cdn/shop/files/IglooCover.jpg?v=1692060598&width=823,https://dangkeebs.com/cdn/shop/files/CopyofDSC01883.jpg?v=1692060598&width=823,https://dangkeebs.com/cdn/shop/files/Copyof20230215-DSC01770copy.jpg?v=1692060598&width=823,https://dangkeebs.com/cdn/shop/files/Copyof20230215-DSC01820copy.jpg?v=1692060598&width=823"
						alt=""
					/>
					<div>
						<span>Keyboards</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>
			</div>
		</div>
	);
}

export default Featured;
