import React, { useEffect, useState } from 'react';
import Product from '../ProductLink/ProductLink';
import { request } from '../../api';
import './Products.css';

const Products = ({ products, title, setMobileFiltersOpen, setSort }) => {
	return (
		<>
			<div className="products-name">
				<h1>{title}</h1>
			</div>

			<div className="products-sort">
				<p>Sort by:</p>
				<select onChange={(e) => setSort(e.target.value)} className="newest">
					<option value="newest">Newest</option>
					<option value="asc">Price (asc)</option>
					<option value="desc">Price (desc)</option>
				</select>
			</div>

			<button
				className="filters-btn-mobile"
				onClick={() => setMobileFiltersOpen(true)}
			>
				Filter by
			</button>

			<div className="products-list-container">
				{products.map((item) => (
					<Product item={item} key={item.id} />
				))}
			</div>
		</>
	);
};

export default Products;
