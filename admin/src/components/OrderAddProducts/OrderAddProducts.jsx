import React, { useState } from 'react';

// Styles
import './OrderAddProducts.css';

// Icons
import { IoClose } from 'react-icons/io5';
import SelectOrderProductsModal from '../SelectOrderProductsModal/SelectOrderProductsModal';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
	removeProductFromOrder,
	incrementProductQuantity,
	decrementProductQuantity,
} from '../../redux/orderProductsRedux';

import { CLIENT_URL } from '../../shared/config';

const OrderAddProducts = () => {
	const dispatch = useDispatch();
	// Get redux order products state
	const orderProductsRedux = useSelector((state) => state.orderProducts);

	const [isAddProductsModalVisible, setIsAddOrderProductsModalVisible] =
		useState(false);

	const removeOrderProduct = (id, price, quantity) => {
		// Remove order product from redux store
		dispatch(
			removeProductFromOrder({ id: id, price: price, quantity: quantity })
		);
	};

	const handleIncrementProductQuantity = (id, price, quantity) => {
		dispatch(
			incrementProductQuantity({ id: id, price: price, quantity: quantity })
		);
	};

	const handleDecrementProductQuantity = (id, price, quantity) => {
		dispatch(
			decrementProductQuantity({ id: id, price: price, quantity: quantity })
		);
	};

	const toggleAddProductsModal = () => {
		setIsAddOrderProductsModalVisible(!isAddProductsModalVisible);
	};

	return (
		<div className="order-add-products-container">
			<p>Select order products</p>

			<button
				type="button"
				className="select-products-btn"
				onClick={() => toggleAddProductsModal()}
			>
				Select products
			</button>

			<div className="order-products-container">
				{orderProductsRedux.orderProducts.map((orderProduct, id) => {
					return (
						<div className="order-product" key={id}>
							<button
								type="button"
								className="close-img-btn"
								onClick={() =>
									removeOrderProduct(
										id,
										orderProduct.price,
										orderProduct.quantity
									)
								}
							>
								<IoClose />
							</button>
							<div className="order-product-info">
								<img
									src={orderProduct.originalProduct.images[0].url}
									alt="Product image"
								/>
								<a
									className="order-product-title"
									href={`${CLIENT_URL}product/${orderProduct.originalProduct._id}`}
								>
									{orderProduct.originalProduct.title}
								</a>
							</div>
							<div className="order-product-quantity">
								<button
									type="button"
									onClick={() =>
										handleDecrementProductQuantity(
											id,
											orderProduct.price,
											orderProduct.quantity
										)
									}
								>
									-
								</button>
								<p>{orderProduct.quantity}</p>
								<button
									type="button"
									onClick={() =>
										handleIncrementProductQuantity(
											id,
											orderProduct.price,
											orderProduct.quantity
										)
									}
								>
									+
								</button>
							</div>
						</div>
					);
				})}
			</div>
			{isAddProductsModalVisible && (
				<SelectOrderProductsModal
					toggleAddProductsModal={toggleAddProductsModal}
				/>
			)}
			<p>
				Total: <span>€{orderProductsRedux.totalPrice}</span>
			</p>
		</div>
	);
};

export default OrderAddProducts;
