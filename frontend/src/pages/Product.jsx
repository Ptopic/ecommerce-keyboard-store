import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';

import { useLocation } from 'react-router-dom';

import { request } from '../api';
import { addProduct } from '../redux/cartRedux';

import { useDispatch } from 'react-redux';
import './Product.css';

import { AiOutlineDown } from 'react-icons/ai';

const Product = () => {
	const location = useLocation();
	const id = location.pathname.split('/')[2];
	const [product, setProduct] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState('');
	const [colorOpen, setColorOpen] = useState(false);
	const [size, setSize] = useState('');

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
		dispatch(addProduct({ ...product, quantity, color, size }));
	};

	const handleFilters = (e) => {};

	useEffect(() => {
		console.log(product);
	}, []);

	const toggleColorOpen = () => {
		if (colorOpen) {
			setColorOpen(false);
		} else {
			setColorOpen(true);
		}
	};

	return (
		<div className="product-page-container">
			<Navbar />
			<div className="product-page-wrapper">
				<div className="product-page-image-container">
					<img src={product.image?.[0]} className="product-item-header-img" />
					{product.image?.slice(1).map((image) => (
						<img src={image} />
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
							{product.color?.length && (
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
							{/* <div>
							<span>Size</span>
							<select name="size" onChange={handleFilters}>
							<option disabled>SIZE</option>
							<option key="all">All</option>
							{product.color?.map((color) => (
								<option>{color}</option>
								))}
								</select>
							</div> */}
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
