import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';

import { useLocation } from 'react-router-dom';

import { request } from '../api';
import { addProduct } from '../redux/cartRedux';

import { useDispatch, useSelector } from 'react-redux';
import { openCart, incrementProductQuantity } from '../redux/cartRedux';

import './Product.css';

import { AiOutlineDown } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

const Product = () => {
	const location = useLocation();
	const id = location.pathname.split('/')[2];
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState('');
	const [colorOpen, setColorOpen] = useState(false);
	const [size, setSize] = useState('');
	const [error, setError] = useState('');
	const [imageZoom, setImageZoom] = useState({});
	const [imageZoomModalOpen, setImageZoomModalOpen] = useState(false);
	const cartProducts = useSelector((state) => state.cart.products);

	const dispatch = useDispatch();

	useEffect(() => {
		const getProductById = async () => {
			try {
				const res = await request.get('/products/find/' + id);
				const data = res.data;
				setProduct(data.data);
				console.log(data.data.image);
			} catch (err) {
				console.log(err);
			}
		};

		getProductById();
	}, [id]);

	const handleQuantity = (type) => {
		if (type == 'increase') {
			setQuantity(quantity + 1);
		} else {
			quantity > 1 && setQuantity(quantity - 1);
		}
	};

	const handleAddToCart = () => {
		// Check if product is already in cart if it is just increment its quantity
		var productAlreadyInCart = false;
		for (var i = 0; i < cartProducts.length; i++) {
			if (
				cartProducts[i]._id == product._id &&
				cartProducts[i].color == color
			) {
				productAlreadyInCart = true;
			}
		}
		// Check if color is selected if not display error
		if (color && !productAlreadyInCart) {
			dispatch(addProduct({ ...product, quantity, color, size }));
			// Open cart when product is added
			dispatch(openCart());
			setError('');
		} else if (productAlreadyInCart) {
			dispatch(
				incrementProductQuantity({
					id: product._id,
					product,
				})
			);
			// Open cart when product is added
			dispatch(openCart());
			setError('');
		} else if (!productAlreadyInCart) {
			dispatch(addProduct({ ...product, quantity, color, size }));
			// Open cart when product is added
			dispatch(openCart());
			setError('');
		} else {
			setError('Please select a color');
		}
	};

	const handleFilters = (e) => {};

	const toggleColorOpen = () => {
		if (colorOpen) {
			setColorOpen(false);
		} else {
			setColorOpen(true);
		}
	};

	const zoomInImage = (img) => {
		setImageZoom(img);
		setImageZoomModalOpen(true);
	};

	return (
		<div className="product-page-container">
			<Navbar />
			{imageZoomModalOpen && (
				<div className="image-zoom-modal">
					<div className="image-zoom-modal-container">
						<img src={imageZoom} alt="" />
						<div
							className="image-zoom-close-overlay"
							onClick={() => setImageZoomModalOpen(false)}
						>
							<AiOutlineClose size={36} />
						</div>
					</div>
				</div>
			)}
			<div className="product-page-wrapper">
				<div className="product-page-image-container">
					<div
						className="product-image header"
						onClick={() => zoomInImage(product.image?.[0])}
					>
						<img src={product.image?.[0]} />
						<div className="image-overlay">
							<BiSearchAlt size={36} />
						</div>
					</div>
					{product.image?.slice(1).map((image) => (
						<div className="product-image" onClick={() => zoomInImage(image)}>
							<img src={image} />
							<div className="image-overlay">
								<BiSearchAlt size={36} />
							</div>
						</div>
					))}
				</div>
				<div className="product-page-info-container">
					<h1>{product.title}</h1>
					<span>€{product.price} EUR</span>
					<p>Shipping calculated at checkout.</p>
					<p className="quantity">Quantity:</p>
					<div className="amount-container">
						<button onClick={() => handleQuantity('decrease')}>-</button>
						<p>{quantity}</p>
						<button onClick={() => handleQuantity('increase')}>+</button>
					</div>
					<div className="product-page-add-container">
						<div className="product-page-filters-container">
							{product.color && product.color.length > 0 && (
								<div className="product-page-filter">
									<span>
										Color <star>*</star>
									</span>
									<div
										className="product-page-filter-color-btn"
										onClick={() => toggleColorOpen()}
									>
										{color ? color : <p>Please select an option*</p>}
										<AiOutlineDown />
									</div>
									<div className="error">{error}</div>
									{colorOpen && (
										<div className="product-page-filter-color-container">
											{product.color?.map((color) => (
												<div
													className="product-page-filter-color-option"
													onClick={() => {
														setColor(color);
														setColorOpen(false);
													}}
												>
													{color}
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>
						<button className="btn" onClick={() => handleAddToCart()}>
							ADD TO CART
						</button>
					</div>
					<p>{product.description}</p>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Product;
