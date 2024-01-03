import React, { useState, useEffect } from 'react';
import './Order.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { request } from '../api';

// Components
import Map from '../components/Map/Map';
import OrderStatus from '../components/OrderStatus/OrderStatus';

// Assets
import logo from '../assets/logo3.png';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

function Order() {
	const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
	const navigate = useNavigate();
	const location = useLocation();
	const id = location.pathname.split('/')[2];
	const [order, setOrder] = useState({});
	const [cordinates, setCordinates] = useState({});

	const getOrderByOrderId = async () => {
		const res = await request.get('/orders/getByOrderId', {
			params: { orderId: id },
		});
		setOrder(res.data.data[0]);
		console.log(res.data.data[0]);

		getAddressCordinates(res.data.data[0]);
	};

	const getAddressCordinates = async (order) => {
		const city = order.shippingInfo.address.city;
		const adresa = order.shippingInfo.address.line1.split(' ');
		console.log(adresa);

		// Map thru address to make object for google maps api
		let query = ``;
		for (var i = adresa.length - 1; i >= 0; i--) {
			query += adresa[i] + '%20';
		}
		console.log(query);
		const res = await request.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${query}${city}&key=${apiKey}`,
			{}
		);
		console.log(res.data.results[0].geometry.location);
		setCordinates(res.data.results[0].geometry.location);
	};
	useEffect(() => {
		getOrderByOrderId();
	}, []);
	return (
		<div className="order-container">
			<div className="order-container-right-mobile"></div>
			<div className="order-container-left">
				<img src={logo} alt="" />

				<div className="thank-you">
					<IoIosCheckmarkCircleOutline className="checkmark" size={64} />
					<div>
						<p>Order #{order?.orderNumber}</p>
						<h2>
							Thank you, {order.name ? order.name.split(' ')[0] : order?.name}!
						</h2>
					</div>
				</div>

				<div className="box map">
					<div className="order-status">
						<OrderStatus status={order?.status} />
					</div>
					<Map
						cordinates={cordinates}
						googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<div style={{ height: `100%` }} />}
						containerElement={
							<div style={{ height: `250px` }} className="map" />
						}
						mapElement={<div style={{ height: `100%` }} />}
					/>

					<div className="box-map-content">
						<h3>Your order is on its way</h3>

						<p>You'll receive updates on its progress</p>
					</div>
				</div>

				<div className="box">
					<h3>Order details</h3>

					<div className="box-details">
						<div className="box-details-left">
							<p className="header">Contact information</p>
							<div>
								<p>{order?.billingInfo?.email}</p>
							</div>

							<p className="header">Shipping address</p>
							<div>
								<p>{order?.shippingInfo?.name}</p>
								<p>{order?.shippingInfo?.address?.line1}</p>
								<p>
									{order?.shippingInfo?.address?.postal_code}{' '}
									{order?.shippingInfo?.address?.city}
								</p>
								<p>Croatia</p>
								<p>{order?.shippingInfo?.phone}</p>
							</div>
						</div>
						<div className="box-details-right">
							<p className="header">Billing address</p>
							<div>
								<p>{order?.billingInfo?.name}</p>
								<p>{order?.billingInfo?.address?.line1}</p>
								<p>
									{order?.billingInfo?.address?.postal_code}{' '}
									{order?.billingInfo?.address?.city}
								</p>
								<p>Croatia</p>
							</div>
							<p className="header">Tvrtka</p>
							<div>
								<p>{order?.tvrtkaDostava}</p>
								<p>{order?.oib}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="need-help">
					<div>
						<p>
							Need help? <Link to="/contact">Contact Us</Link>
						</p>
					</div>
					<div>
						<Link to="/" className="btn">
							Continue shopping
						</Link>
					</div>
				</div>
			</div>
			<div className="order-container-right">
				{order.products?.map((product) => (
					<div className="order-products">
						<div className="order-products-image">
							<div className="badge">{product.quantity}</div>
							<img src={product.originalProduct.image[0]} alt="" />
						</div>
						<div className="order-products-info">
							<h3>{product.originalProduct.title}</h3>
							<p>{product?.color}</p>
						</div>
						<div className="order-products-price">
							<h3>{product.price}€</h3>
						</div>
					</div>
				))}

				<div className="devider-products"></div>

				<div className="order-summary">
					<div>
						<p>Subtotal</p>
						<h3>{order.amount > 20 ? order.amount : order.amount - 3}€</h3>
					</div>
					<div>
						<p>Discount</p> <h3>0.00€</h3>
					</div>
					<div>
						<p>Shipping</p> <h3>{order.amount > 20 ? '0.00€' : '3.00€'}</h3>
					</div>
				</div>

				<div className="devider-products"></div>

				<div className="order-total">
					<p>Total</p> <h3>{order.amount}€</h3>
				</div>
			</div>
		</div>
	);
}

export default Order;
