import React, { useState } from 'react';

// Styles
import './OrderAddProducts.css';

// Icons
import { IoClose } from 'react-icons/io5';
import SelectOrderProductsModal from '../SelectOrderProductsModal/SelectOrderProductsModal';

const OrderAddProducts = () => {
	const [orderProducts, setOrderProducts] = useState([]);
	const [isAddProductsModalVisible, setIsAddOrderProductsModalVisible] =
		useState(false);

	const removeOrderProduct = (e, id) => {
		e.preventDefault();
		const filteredOrderProducts = orderProducts.filter(
			(_, index) => index != id
		);

		setOrderProducts(filteredOrderProducts);
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
				{orderProducts.map((orderProduct, id) => {
					return (
						<div className="order-product" key={id}>
							<button
								type="button"
								className="close-img-btn"
								onClick={(e) => removeOrderProduct(e, id)}
							>
								<IoClose />
							</button>
							<img src={orderProduct.images[0].url} alt="Product image" />
						</div>
					);
				})}
			</div>
			{isAddProductsModalVisible && (
				<SelectOrderProductsModal
					toggleAddProductsModal={toggleAddProductsModal}
				/>
			)}
		</div>
	);
};

export default OrderAddProducts;
