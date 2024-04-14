import React, { useState } from 'react';
import './QuantityBtn.css';
import { useDispatch } from 'react-redux';
import {
	incrementProductQuantity,
	decrementProductQuantity,
} from '../../redux/configuratorRedux';

const QuantityBtn = ({ product, categoryName }) => {
	const dispatch = useDispatch();
	const changeQuantity = (product, type) => {
		if (type === 'increase') {
			dispatch(incrementProductQuantity({ product, categoryName }));
		} else {
			dispatch(decrementProductQuantity({ product, categoryName }));
		}
	};
	return (
		<div className="configurator-change-quantity">
			<div className="configurator-change-quantity-btns">
				<button
					className="configurator-quantity-btn"
					onClick={() => changeQuantity(product, 'decrease')}
				>
					-
				</button>
				<p>{product.quantity}</p>
				<button
					className="configurator-quantity-btn"
					onClick={() => changeQuantity(product, 'increase')}
				>
					+
				</button>
			</div>
		</div>
	);
};

export default QuantityBtn;
