import React, { useState } from 'react';
import '../Cart/Cart.css';

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
			product.quantity += 1;
			// Increase configuration total
			newConfiguratorValue.total += product.price;
		} else {
			product.quantity = product.quantity > 1 ? product.quantity - 1 : 1;
			// Decrease configuration total
			newConfiguratorValue.total -= product.price;
		}
		setQuantity(product.quantity);

		// Update product quantity in configurator state with new product quantity

		newConfiguratorValue['configuration'][categoryName][id].quantity =
			product.quantity;

		setConfiguratorModalValues({ ...newConfiguratorValue });
	};
	return (
		<div className="change-quantity">
			<div className="change-quantity-btns">
				<button
					className="quantity-btn"
					onClick={() => changeQuantity(product, 'decrease')}
				>
					-
				</button>
				<p>{quantity}</p>
				<button
					className="quantity-btn"
					onClick={() => changeQuantity(product, 'increase')}
				>
					+
				</button>
			</div>
		</div>
	);
};

export default QuantityBtn;
