import React from 'react';

// Styles
import './OrderProductsTable.css';
import '../../styles/tables.css';

const OrderProductsTable = ({ data }) => {
	return (
		<div className="order-products-table">
			{data &&
				data.map((product) => {
					return (
						<div
							className="order-products-table-body-row"
							style={{
								gridTemplateColumns:
									data.length > 0
										? '4fr ' +
										  `repeat(${Object.keys(product.details).length}, 1fr)` +
										  ' 1.5fr'
										: null,
							}}
						>
							<div className="order-products-table-body-cell">
								<img src={product.images[0].url} alt="product image" />
								<p>{product.title}</p>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default OrderProductsTable;
