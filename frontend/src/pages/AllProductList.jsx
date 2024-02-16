import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Products from '../components/Products/Products';
import Footer from '../components/Footer/Footer';
import { AiOutlineClose } from 'react-icons/ai';
import { useLocation, useSearchParams } from 'react-router-dom';
import './ProductList.css';
import { request } from '../api';
import ReactSlider from 'react-slider';
import { motion as m, AnimatePresence } from 'framer-motion';

import Spinner from '../components/Spinner/Spinner';

let minPrice = 0;
let maxPrice = 0;

const AllProductList = () => {
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

	const loadRef = useRef(null);

	const [products, setProducts] = useState([]);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const category = location.pathname.split('/')[2];
	const name = searchParams.get('name');
	const [sort, setSort] = useState('newest');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	// Filters for products
	const [material, setMaterial] = useState([]);
	const [defaultMaterial, setDefaultMaterial] = useState(null);
	const [color, setColor] = useState([]);
	const [defaultColor, setDefaultColor] = useState(null);
	const [defaultStock, setDefaultStock] = useState(null);

	// Price filters
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	const generateFilters = (data) => {
		setLoading(true);
		// Check if product has material, color ect...
		var products = data.data;
		var product = products[0];

		// Get min and max price of products
		var allPrices = [];
		products.map((product) => {
			allPrices.push(product.price);
		});
		minPrice = Math.min(...allPrices);
		setMin(minPrice);
		maxPrice = Math.max(...allPrices);
		setMax(maxPrice);

		// Create sets of unique materials and colors if available for products

		// Loop thru and add all materials to array
		var allMaterials = [];
		products.map((product) => {
			product.material.map((material) => {
				allMaterials.push(material);
			});
		});
		// Create set of materials
		var materialsSet = Array.from(new Set(allMaterials));
		setMaterial(materialsSet);

		// Loop thru and add all colors to array
		var allColors = [];
		products.map((product) => {
			product['color'].map((color) => {
				allColors.push(color);
			});
		});
		// Create set of materials
		var colorSet = Array.from(new Set(allColors));
		setColor(colorSet);

		setMin(minPrice);
		setMax(maxPrice);
		setLoading(false);
	};

	const getInitialProducts = async () => {
		try {
			let data;
			setLoading(true);
			const res = await request.get(`/products`, {
				params: {
					page: page,
					pageSize: 10,
				},
			});
			data = res.data;
			setLoading(false);
			// if (products.length == 0) {
			// 	generateFilters(data);
			// }
			setProducts(data.data);
			console.log(data.data);
			setPage((prevPage) => prevPage + 1);
		} catch (err) {
			console.log(err);
		}
	};

	const resetFilters = () => {
		setPage(1);
		setHasMore(true);
	};

	useEffect(() => {
		getInitialProducts();
	}, [category]);

	useEffect(() => {
		getInitialProducts();
		resetFilters();
	}, [sort, defaultColor, defaultMaterial, defaultStock, min, max]);

	const handlePriceFilterChange = (value) => {
		console.log(value);
		// Add value to min max
		setMin(value[0]);
		setMax(value[1]);
		// Reset filters
		resetFilters();
	};

	return (
		<div className="products-section">
			<Navbar />

			{/* Filters on mobile layout */}
			<AnimatePresence>
				{mobileFiltersOpen && (
					<m.div
						className="filter-by-container"
						initial={{ x: -80, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ ease: 'easeInOut', duration: 0.4 }}
						exit={{
							opacity: 0,
							x: -80,
							transition: {
								ease: 'easeInOut',
								duration: 0.4,
							},
						}}
					>
						<div className="filters-by-content">
							<div className="filters-header-container">
								<p className="filters-header">FILTER BY</p>
								<AiOutlineClose
									size={26}
									onClick={() => setMobileFiltersOpen(false)}
								/>
							</div>
							<div className="filters-devider"></div>
							{material.length > 0 && (
								<div>
									<span>MATERIAL:</span>
									<br></br>
									<select
										name="material"
										onChange={(e) => setDefaultMaterial(e.target.value)}
										value={defaultMaterial}
									>
										<option disabled>MATERIAL</option>
										<option key="all">All</option>
										{material.map((m) => (
											<option>{m}</option>
										))}
									</select>
								</div>
							)}
							<div className="stock-filters">
								<span>STOCK STATUS:</span>
								<br></br>
								<select
									name="stock"
									onChange={(e) => setDefaultStock(e.target.value)}
									value={defaultStock}
								>
									<option disabled>STOCK STATUS</option>
									<option>In Stock</option>
									<option>Out Of Stock</option>
								</select>
							</div>

							<div className="price-filters">
								<span>PRICE:</span>
								<div className="slider-mobile-container">
									<div className="price-range-current">
										<p>€{min}</p>
										<p>€{max}</p>
									</div>
									<ReactSlider
										className="slider"
										onAfterChange={(value) => handlePriceFilterChange(value)}
										value={[min, max]}
										min={minPrice}
										max={maxPrice}
									/>
									<div className="price-ranges">
										<p>€{minPrice}</p>
										<p>€{maxPrice}</p>
									</div>
								</div>
							</div>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			{/* Desktop layout */}
			<div className="products-container">
				<div className="products-content">
					<div className="sort-container"></div>
					<div className="products-sort-container">
						<div className="filters-container">
							{material.length > 0 && (
								<div>
									<span>MATERIAL:</span>
									<br></br>
									<select
										name="material"
										onChange={(e) => setDefaultMaterial(e.target.value)}
										value={defaultMaterial}
									>
										<option disabled>MATERIAL</option>
										<option key="all">All</option>
										{material.map((m) => (
											<option>{m}</option>
										))}
									</select>
								</div>
							)}

							<div>
								<span>PRICE:</span>
								<div className="price-ranges">
									<p>{min}</p>
									<p>{max}</p>
								</div>
								<ReactSlider
									className="slider"
									onAfterChange={(value) => handlePriceFilterChange(value)}
									value={[min, max]}
									min={minPrice}
									max={maxPrice}
								/>
								<div className="price-ranges">
									<p>{minPrice}</p>
									<p>{maxPrice}</p>
								</div>
							</div>
						</div>
						{loading ? (
							<div className="spinner-container">
								<Spinner />
							</div>
						) : (
							<>
								<Products
									products={products}
									title={'All Products'}
									setMobileFiltersOpen={setMobileFiltersOpen}
									setSort={setSort}
								/>
								<div className="has-more-spinner">
									{!loading && hasMore ? (
										<div className="spinner-container" ref={loadRef}>
											<Spinner />
										</div>
									) : null}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AllProductList;