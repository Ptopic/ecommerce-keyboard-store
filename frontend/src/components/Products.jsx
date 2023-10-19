import React, { useEffect, useState } from 'react';
import Product from './ProductLink';
import { request } from '../api';
import './Products.css';

const Products = ({ products }) => {
	return (
		<div className="products-list-container">
			{products.map((item) => (
				<Product item={item} key={item.id} />
			))}
		</div>
	);
};

export default Products;
