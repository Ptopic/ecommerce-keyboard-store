import { Link } from 'react-router-dom';
import './ProductLink.css';

const ProductLink = ({ item }) => {
	return (
		<div className="product-link-container">
			<Link to={`/product/${item._id}`}>
				<img src={item.images[0].url} />
				<div className="product-link-info">
					<div className="product-link-name">
						<p className="info-name">{item.title.slice(0, 70)}</p>
					</div>
					<div className="product-link-description">
						<p
							className="info-description"
							dangerouslySetInnerHTML={{ __html: item.specifications }}
						></p>
					</div>
				</div>
			</Link>
			<div className="product-link-price">
				<p className="info-price">€{item.price} EUR</p>
			</div>
		</div>
	);
};

export default ProductLink;
