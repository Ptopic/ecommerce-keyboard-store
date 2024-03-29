import { Link } from 'react-router-dom';
import './ProductLink.css';
import { useState } from 'react';
import { formatPriceDisplay } from '../../utils/formatting';

const ProductLink = ({ item }) => {
	return (
		<div className="product-link-container">
			<Link to={`/product/${item._id}`}>
				<img src={item.images[0].url} />
				<div className="product-link-info">
					<div className="product-link-name">
						<p className="info-name">{item.title}</p>
					</div>
					<div className="product-link-description">
						<p
							className="info-description"
							dangerouslySetInnerHTML={{ __html: item.specifications }}
						></p>
					</div>
					<div className="is-available">
						{item.stock > 0 ? (
							<p className="item-available">Available</p>
						) : (
							<p className="item-out-of-stock">Out of Stock</p>
						)}
					</div>
					<div className="product-link-price">
						<p className="info-price">€{formatPriceDisplay(item.price)}</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ProductLink;
