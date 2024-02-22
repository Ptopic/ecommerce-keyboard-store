import React, { useState, useEffect } from 'react';
import '../Navbar/Navbar.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { request } from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	closeCart,
	removeProduct,
	incrementProductQuantity,
	decrementProductQuantity,
} from '../../redux/cartRedux';
import { BsTrash3 } from 'react-icons/bs';

// Components
import Button from '../Button/Button';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';

function Cart() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state?.user?.currentUser);

	console.log(user.data);

	const [isLoading, setIsLoading] = useState(false);

	const makePaymentRequest = async () => {
		document.body.style.overflow = 'visible';
		navigate('/checkout');
		// close cart
		dispatch(closeCart());
		try {
			setIsLoading(true);
			const res = await request.post('/checkout/payment', {
				products: cart.products,
				amount: cart.totalPrice * 100,
			});
			setIsLoading(false);
			console.log(res);
			dispatch(closeCart());
			window.location.assign(res.data.url);
		} catch (err) {
			console.log(err);
		}
	};

	const continueShopping = () => {
		dispatch(closeCart());
		document.body.style.overflow = 'visible';
	};

	const changeQuantity = (product, type) => {
		if (type === 'increase') {
			dispatch(
				incrementProductQuantity({
					id: product._id,
					product,
				})
			);
		} else {
			dispatch(
				decrementProductQuantity({
					id: product._id,
					product,
				})
			);
		}
	};

	return (
		<div className="cart-content">
			<div className="cart-container">
				<div className="cart">
					{cart.products.length > 0 ? (
						<div className="cart-non-empty">
							<div className="cart-navigation">
								<p>Your cart:</p>
								<AiOutlineClose size={32} onClick={() => continueShopping()} />
							</div>

							<div className="cart-devider">
								<p>PRODUCT</p>

								<p>TOTAL</p>
							</div>

							<div className="cart-products">
								{cart.products.map((product, i) => (
									<div className="cart-product">
										<div className="cart-product-left">
											<img src={product.images[0].url} alt="product img" />
										</div>
										<div className="cart-product-center">
											<Link
												to={`/product/${product._id}`}
												className="cart-product-title"
												onClick={() => continueShopping()}
											>
												{product.title}
											</Link>
											<p className="cart-product-price">
												€{formatPriceDisplay(product.price)}
											</p>
											{product.color.length > 0 && (
												<p style={{ fontSize: '1.6rem' }}>
													Color: {product.color}
												</p>
											)}
											<div className="change-quantity">
												<div className="change-quantity-form">
													<button
														className="quantity-btn"
														onClick={() => changeQuantity(product, 'decrease')}
													>
														-
													</button>
													<p>{product.quantity}</p>
													<button
														className="quantity-btn"
														onClick={() => changeQuantity(product, 'increase')}
													>
														+
													</button>
												</div>

												<div className="remove-btn">
													<BsTrash3
														size={20}
														onClick={() =>
															dispatch(
																removeProduct({
																	id: product._id,
																	price: product.price,
																	quantity: product.quantity,
																	color: product.color,
																})
															)
														}
													/>
												</div>
											</div>
										</div>

										<div className="cart-product-right">
											<p>
												€{formatPriceDisplay(product.price * product.quantity)}
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="cart-checkout">
								<div className="cart-total-price">
									<p>Estimated total:</p>
									<p>€{formatPriceDisplay(cart.totalPrice)}</p>
								</div>
								<Button
									width={'100%'}
									text={'Checkout'}
									onClickFunction={makePaymentRequest}
									isLoading={isLoading}
								/>
							</div>
						</div>
					) : (
						<div className="cart-empty">
							<div className="cart-navigation-empty">
								<AiOutlineClose size={32} onClick={() => continueShopping()} />
							</div>
							<h1>Your cart is empty</h1>

							<Button
								text={'Continue shopping'}
								onClickFunction={continueShopping}
								isLoading={isLoading}
							/>

							{Object.keys(user) == 0 ? (
								<>
									<p style={{ marginBottom: '1.4rem' }}>Have an account?</p>
									<p>
										<Link to="/login" onClick={() => continueShopping()}>
											Log in
										</Link>{' '}
										to checkout faster
									</p>
								</>
							) : null}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Cart;
