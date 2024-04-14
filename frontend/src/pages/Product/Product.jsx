import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

import { useLocation, useNavigate } from 'react-router-dom';

import { request, userRequest } from '../../api';

import { useDispatch, useSelector } from 'react-redux';
import {
	openCart,
	addProduct,
	incrementProductQuantity,
} from '../../redux/cartRedux';

import './Product.css';

import { toast, Toaster } from 'react-hot-toast';

import {
	AiOutlineDown,
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineClose,
	AiOutlineLeft,
	AiOutlineRight,
} from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import Button from '../../components/Button/Button';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';
import { user_request } from '../../../../admin/src/api';

import { useSwipeable } from 'react-swipeable';
import Spinner from '../../components/Spinner/Spinner';

const Product = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/')[2];
	const [isProductLoading, setIsProductLoading] = useState(false);
	const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [product, setProduct] = useState({});
	const [isProductInWishlist, setIsProductInWishlist] = useState(false);
	const [quantity, setQuantity] = useState(1);

	const [color, setColor] = useState('');
	const [colorOpen, setColorOpen] = useState(false);
	const [size, setSize] = useState('');

	const [imageZoomModalOpen, setImageZoomModalOpen] = useState(false);
	const [activeHeaderImage, setActiveHeaderImage] = useState(0);
	const [activeImageIndex, setActiveImageIndex] = useState(0);

	const PRODUCT_IMAGES_LENGTH = product?.images?.length;

	const handleNext = () => {
		setActiveImageIndex((prevIndex) => (prevIndex + 1) % PRODUCT_IMAGES_LENGTH);
	};

	const handlePrev = () => {
		setActiveImageIndex(
			(prevIndex) =>
				(prevIndex - 1 + PRODUCT_IMAGES_LENGTH) % PRODUCT_IMAGES_LENGTH
		);
	};

	const handlers = useSwipeable({
		onSwipedLeft: () => handleNext(),
		onSwipedRight: () => handlePrev(),
	});

	const cartProducts = useSelector((state) => state.cart.products);
	const currentUser = useSelector((state) => state.user.currentUser);

	const dispatch = useDispatch();

	const getProductById = async () => {
		try {
			setIsProductLoading(true);
			const res = await request.get('/products/find/' + id);
			const data = res.data;
			setProduct(data.data);
			setIsProductLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	const getWishlist = async () => {
		try {
			// Check if product is in users wishlist
			const wishlist = await request.get(`/wishlist?userId=${currentUser._id}`);

			const products = wishlist.data.data.products;

			// Loop thru products to find id of current product
			for (let i = 0; i < products.length; i++) {
				if (products[i]._id == id) {
					setIsProductInWishlist(true);
				}
			}
		} catch (error) {
			console.log(error?.response?.data);
		}
	};

	useEffect(() => {
		// Scroll to top
		window.scrollTo(0, 0);
		getProductById();
		getWishlist();
	}, []);

	// Refetch product when location (url) changes
	useEffect(() => {
		getProductById();
	}, [location]);

	const handleQuantity = (type) => {
		if (type == 'increase') {
			setQuantity(quantity + 1);
		} else {
			quantity > 1 && setQuantity(quantity - 1);
		}
	};

	const handleAddToWishlist = async () => {
		if (!currentUser || currentUser?.length == 0) {
			navigate('/login');
		}

		// Add product to users wishlist (token might be needed)
		if (Object.keys(currentUser)?.length != 0) {
			const productId = product._id;
			const userId = currentUser._id;

			try {
				setIsLoadingWishlist(true);
				const res = await userRequest.post(`/wishlist?id=${userId}`, {
					userId: userId,
					productId: productId,
				});
				setIsLoadingWishlist(false);
				setIsProductInWishlist(true);
				toast.success('Product added to wishlist');
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong');
			}
		} else {
			toast.error('Please login to add products to wishlist');
		}
	};

	const handleRemoveFromWishlist = async () => {
		const productId = product._id;
		const userId = currentUser._id;

		try {
			setIsLoadingWishlist(true);
			const config = {
				data: {
					userId: userId,
					productId: productId,
				},
			};
			const res = await userRequest.delete(`/wishlist?id=${userId}`, config);
			setIsLoadingWishlist(false);
			setIsProductInWishlist(false);
			toast.success('Product removed from wishlist');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
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
			dispatch(addProduct({ ...product, quantity }));
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

	const zoomInImage = (index) => {
		setActiveImageIndex(index);
		setImageZoomModalOpen(true);
	};

	return (
		<div className="product-page-container">
			<Toaster />
			<Navbar />
			{isProductLoading ? (
				<div className="product-spinner-container">
					<Spinner />
				</div>
			) : (
				<>
					{imageZoomModalOpen && (
						<div className="image-zoom-modal">
							<div className="image-zoom-modal-container" {...handlers}>
								<div className="images-carousel-collection">
									{product.images.length > 1 && (
										<AiOutlineLeft
											size={34}
											onClick={() => handlePrev()}
											className="arrow left"
											fill="#fff"
										/>
									)}
									{product.images.map((image, index) => {
										return (
											<img
												src={image.url}
												className={
													activeImageIndex === index ? 'slide' : 'slide hidden'
												}
											/>
										);
									})}
									{product.images.length > 1 && (
										<AiOutlineRight
											size={34}
											onClick={() => handleNext()}
											className="arrow right"
											fill="#fff"
										/>
									)}
									<AiOutlineClose
										size={36}
										className="image-close-icon"
										onClick={() => setImageZoomModalOpen(false)}
									/>
								</div>
							</div>
						</div>
					)}
					<div className="product-page-wrapper">
						<div className="product-page-image-container">
							<div
								className="product-image header"
								onClick={() => zoomInImage(activeHeaderImage)}
							>
								<img src={product.images?.[activeHeaderImage].url} />
								<div className="image-overlay">
									<BiSearchAlt size={36} />
								</div>
							</div>
							<div className="product-images-previews">
								{product.images?.map((image, index) => (
									<div
										className={
											activeHeaderImage === index
												? 'product-image small active'
												: 'product-image small'
										}
										onClick={() => setActiveHeaderImage(index)}
									>
										<img src={image.url} />
										<div className="image-overlay">
											<BiSearchAlt size={36} />
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="product-page-info-container">
							<h1>{product.title}</h1>
							<div
								className="product-specifications-display"
								dangerouslySetInnerHTML={{ __html: product.specifications }}
							></div>
							<span>€{formatPriceDisplay(product.price)}</span>
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
										width={'100%'}
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
										width={'100%'}
									/>
								</div>
								<div
									className="product-specifications-display"
									dangerouslySetInnerHTML={{ __html: product.description }}
								></div>
							</div>
						</div>
					</div>
				</>
			)}
			<Footer />
		</div>
	);
};

export default Product;
