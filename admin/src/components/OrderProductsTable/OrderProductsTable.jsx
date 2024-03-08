import React, { useState, useEffect } from 'react';

// Styles
import './OrderProductsTable.css';
import '../../styles/tables.css';

// Utils
import { formatPriceDisplay } from '../../../../frontend/src/utils/formatting';

// Redux
import { useDispatch } from 'react-redux';
import { addProductToOrder } from '../../redux/orderProductsRedux';

const OrderProductsTable = ({ products, toggleAddProductsModal }) => {
	const dispatch = useDispatch();

	const handleAddProductToOrder = (product) => {
		dispatch(addProductToOrder(product));
		toggleAddProductsModal();
	};

	return (
		<div className="order-products-table">
			<div
				className="order-products-table-head"
				style={{
					/* Set header grid columns as number of keys in details object */
					gridTemplateColumns:
						products && products?.length > 0
							? '4fr ' +
							  `repeat(${Object.keys(products[0].details).length}, 1fr)` +
							  ' 1.5fr'
							: null,
				}}
			>
				Naziv
				{/* Display product details keys - for table head */}
				{products &&
					products?.length > 0 &&
					Object.keys(products[0].details).map((detail, i) => {
						return <p>{detail}</p>;
					})}
				Cijena
			</div>
			{products &&
				products.map((product) => {
					return (
						<div
							className="order-products-table-body-row"
							style={{
								gridTemplateColumns:
									products.length > 0
										? '4fr ' +
										  `repeat(${Object.keys(product.details).length}, 1fr)` +
										  ' 1.5fr'
										: null,
							}}
						>
							<div className="order-products-table-body-cell title">
								<img src={product.images[0].url} alt="product image" />
								<h3>{product.title}</h3>
							</div>
							{Object.keys(product.details).map((productDetail, i) => {
								return (
									<div
										className="configurator-products-table-body-row-cell desktop"
										key={i}
									>
										<div className="product-detail">
											<p className="detail-value">
												{product.details[productDetail]}
											</p>
										</div>
									</div>
								);
							})}
							<div className="order-products-table-body-cell price">
								<h3>€{formatPriceDisplay(product.price)}</h3>
								<button
									type="button"
									onClick={() => handleAddProductToOrder(product)}
								>
									Add
								</button>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default OrderProductsTable;
