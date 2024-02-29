import React, { useState } from 'react';
import './QuantityBtn.css';

const QuantityBtn = ({
	product,
	categoryName,
	id,
	configuratorModalValues,
	setConfiguratorModalValues,
}) => {
	const [quantity, setQuantity] = useState(product.quantity);
	const changeQuantity = (product, type) => {
		// get current configurator values
		let newConfiguratorValue = configuratorModalValues;

		if (type === 'increase') {
			// Increase configuration total
			newConfiguratorValue.total += product.price;
			product.quantity += 1;
		} else {
			// Decrease configuration total
			newConfiguratorValue.total =
				product.quantity > 1
					? newConfiguratorValue.total - product.price
					: newConfiguratorValue.total;
			product.quantity = product.quantity > 1 ? product.quantity - 1 : 1;
		}
		setQuantity(product.quantity);

		// Update product quantity in configurator state with new product quantity

		newConfiguratorValue['configuration'][categoryName][id].quantity =
			product.quantity;

		setConfiguratorModalValues({ ...newConfiguratorValue });
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
				<p>{quantity}</p>
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
