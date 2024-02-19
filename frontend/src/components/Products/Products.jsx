import React, { useEffect, useState } from 'react';
import ProductLink from '../ProductLink/ProductLink';
import { request } from '../../api';
import './Products.css';

const Products = ({
	products,
	title,
	setMobileFiltersOpen,
	setTempSort,
	sort,
	direction,
}) => {
	return (
		<>
			<div className="products-name">
				<h1>{title}</h1>
			</div>

			<div className="products-sort">
				<p>Sortiraj prema:</p>
				<select
					onChange={(e) => setTempSort(e.target.value)}
					className="newest"
					value={sort + '-' + direction}
				>
					<option value="createdAt-desc">Najnoviji</option>
					<option value="title-asc">Naziv A-Z</option>
					<option value="title-desc">Naziv Z-A</option>
					<option value="price-asc">Cijena Rastuća</option>
					<option value="price-desc">Cijena Padajuća</option>
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
					<ProductLink item={item} key={item._id} />
				))}
			</div>
		</>
	);
};

export default Products;
