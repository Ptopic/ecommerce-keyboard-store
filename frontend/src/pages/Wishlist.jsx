import React, { useState, useEffect } from 'react';
import './Wishlist.css';
import { request } from '../api';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar/Navbar';

import { toast, Toaster } from 'react-hot-toast';

import { formatPriceDisplay } from '../utils/formatting';

function Wishlist() {
	const currentUser = useSelector((state) => state.user.currentUser);
	const [wishlist, setWishlist] = useState([]);
	useEffect(() => {
		const getWishlist = async () => {
			try {
				// Check if product is in users wishlist
				const wishlist = await request.get(
					`/wishlist?userId=${currentUser.data._id}`
				);
				// If users wishlist doesnt exist prompt him to add some products to create it
				if (wishlist.data.message) {
					toast.success(wishlist.data.message);
				} else {
					setWishlist(wishlist.data.data.products);
				}
			} catch (error) {
				console.log(error);
				console.log(error?.response?.data);
			}
		};
		getWishlist();
	}, []);
	return (
		<div>
			<Toaster />
			<Navbar />

			<div className="wishlist-container">
				<h1>Your wishlist:</h1>

				<div className="wishlist-items">
					{wishlist.length === 0 && (
						<p className="wishlist-empty">Your wishlist is empty</p>
					)}
					{wishlist.map((item) => (
						<Link to={`/product/${item._id}`} className="wishlist-item">
							<img src={item?.images[0]?.url} alt="" />
							<div className="wishlist-item-info">
								<h2>{item?.title}</h2>
								<p
									dangerouslySetInnerHTML={{ __html: item?.specifications }}
								></p>
								<p className="item-price">€{formatPriceDisplay(item.price)}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export default Wishlist;
