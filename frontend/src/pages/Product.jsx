import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';

import { useLocation, useNavigate } from 'react-router-dom';

import { request } from '../api';
import { addProduct } from '../redux/cartRedux';

import { useDispatch, useSelector } from 'react-redux';
import { openCart, incrementProductQuantity } from '../redux/cartRedux';

import './Product.css';

import { toast, Toaster } from 'react-hot-toast';

import { AiOutlineDown, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../components/Button/Button';

const Product = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/')[2];
	const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [product, setProduct] = useState({});
	const [isProductInWishlist, setIsProductInWishlist] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [color, setColor] = useState('');
	const [colorOpen, setColorOpen] = useState(false);
	const [size, setSize] = useState('');
	const [imageZoom, setImageZoom] = useState({});
	const [imageZoomModalOpen, setImageZoomModalOpen] = useState(false);
	const cartProducts = useSelector((state) => state.cart.products);
	const currentUser = useSelector((state) => state.user.currentUser);

	const dispatch = useDispatch();

	useEffect(() => {
		const getProductById = async () => {
			try {
				const res = await request.get('/products/find/' + id);
				const data = res.data;
				setProduct(data.data);
			} catch (err) {
				console.log(err);
			}
		};

		const getWishlist = async () => {
			try {
				// Check if product is in users wishlist
				const wishlist = await request.get(
					`/wishlist?userId=${currentUser.data._id}`
				);

				const products = wishlist.data.data.products;
				console.log(products);
				// Loop thru products to find id of current product
				for (let i = 0; i < products.length; i++) {
					if (products[i]._id == id) {
						setIsProductInWishlist(true);
					}
				}
			} catch (error) {
				console.log(error.response.data);
			}
		};
		getProductById();
		getWishlist();
	}, []);

	const handleQuantity = (type) => {
		if (type == 'increase') {
			setQuantity(quantity + 1);
		} else {
			quantity > 1 && setQuantity(quantity - 1);
		}
	};

	const handleAddToWishlist = async () => {
		if (currentUser.length == 0) {
			navigate('/login');
		}

		// Add product to users wishlist (token might be needed)
		const productId = product._id;
		const userId = currentUser.data._id;

		try {
			setIsLoadingWishlist(true);
			console.log(currentUser.token);
			const res = await request.post(
				`/wishlist?id=${userId}`,
				{
					userId: userId,
					productId: productId,
				},
				{
					headers: {
						token: currentUser.token,
					},
				}
			);
			setIsLoadingWishlist(false);
			console.log(res);
			setIsProductInWishlist(true);
			toast.success(res.data.data);
		} catch (error) {
			console.log(error);
			toast.error(error.response.data);
		}
	};

	const handleRemoveFromWishlist = async () => {
		const productId = product._id;
		const userId = currentUser.data._id;

		try {
			setIsLoadingWishlist(true);
			const config = {
				headers: {
					token: currentUser.token,
				},
				data: {
					userId: userId,
					productId: productId,
				},
			};
			const res = await request.delete(`/wishlist?id=${userId}`, config);
			setIsLoadingWishlist(false);
			setIsProductInWishlist(false);
			console.log(res);
			toast.success(res.data.data);
		} catch (error) {
			console.log(error.response.data);
			toast.error(error.response.data);
		}
	};

	const handleAddToCart = () => {
		setIsLoading(true);
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
		// Check if quantity is greater than stock if it is display message
		if (quantity > product.stock) {
			toast.error('Quantity cannot be greater than stock');
			setIsLoading(false);
			return;
		}
		if (!color && product.color.length > 0) {
			toast.error('Please select a color');
			setIsLoading(false);
		}
		// Check if color is selected if not display error
		else if (color && !productAlreadyInCart) {
			dispatch(addProduct({ ...product, quantity, color, size }));
			// Open cart when product is added
			dispatch(openCart());
			setIsLoading(false);
		} else if (productAlreadyInCart) {
			dispatch(
				incrementProductQuantity({
					id: product._id,
					product,
				})
			);
			// Open cart when product is added
			dispatch(openCart());
			setIsLoading(false);
		} else {
			dispatch(addProduct({ ...product, quantity, color, size }));
			// Open cart when product is added
			dispatch(openCart());
			setIsLoading(false);
		}
	};

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
			<Toaster />
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
					{product.stock == 0 ? (
						<h2 className="out-of-stock">Out of stock</h2>
					) : null}
					<p>Stock: {product.stock}</p>
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
						<div className="product-buttons">
							<Button
								backgroundColor={'#E81123'}
								borderColor={'#000000'}
								textColor={'#fff'}
								isLoading={isLoadingWishlist}
								disabled={product.stock == 0 ? true : false}
								onClickFunction={
									isProductInWishlist
										? handleRemoveFromWishlist
										: handleAddToWishlist
								}
								icon={
									isProductInWishlist ? <AiFillHeart /> : <AiOutlineHeart />
								}
								text={'Add to wishlsit'}
							/>
							<Button
								disabled={product.stock == 0 ? true : false}
								isLoading={isLoading}
								onClickFunction={handleAddToCart}
								text={'Add to Cart'}
							/>
						</div>
					</div>
					<p>{product.description}</p>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Product;
