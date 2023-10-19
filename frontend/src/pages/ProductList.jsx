import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Products from '../components/Products';
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

const ProductList = () => {
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const category = location.pathname.split('/')[2];
	const name = searchParams.get('name');
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState('newest');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	// Filters for products
	const [material, setMaterial] = useState([]);
	const [defaultMaterial, setDefaultMaterial] = useState('All');
	const [color, setColor] = useState([]);
	const [defaultColor, setDefaultColor] = useState('All');
	const [defaultStock, setDefaultStock] = useState('In Stock');

	// Price filters
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	const resetFilters = () => {
		setFilters({});
	};

	useEffect(() => {
		const getProducts = async () => {
			try {
				setLoading(true);
				const res = await request.get(
					category ? `/products?category=${category}` : '/products'
				);
				setLoading(false);
				const data = res.data;
				setProducts(data.data);

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
				if (product['material'].length > 0) {
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
				}
				if (product['color'].length > 0 && product['color'] != '') {
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
				}
			} catch (err) {
				console.log(err);
			}
		};
		getProducts();
	}, [category]);

	useEffect(() => {}, [min, max]);

	const handlePriceFilterChange = (value) => {
		// Add value to min max
		setMin(value[0]);
		setMax(value[1]);
		// Reset filters
		resetFilters();
		setDefaultColor('all');
		setDefaultMaterial('all');
		setDefaultStock('In Stock');

		// Filter products by price and set filteredProducts to those products
		setFilteredProducts(
			products.filter((item) => item.price >= min && item.price <= max)
		);
	};

	useEffect(() => {
		if (category) {
			setFilteredProducts(
				products.filter((item) =>
					Object.entries(filters).every(([key, value]) =>
						item[key].includes(value)
					)
				)
			);
		}
	}, [products, category, filters]);

	useEffect(() => {
		if (sort == 'newest') {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => a.createdAt - b.createdAt)
			);
		} else if (sort == 'asc') {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => a.price - b.price)
			);
		} else {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => b.price - a.price)
			);
		}
	}, [sort]);

	const handleFilters = (e) => {
		// Mobile fix so values dont return to default values
		const value = e.target.value;
		if (e.target.name == 'material') {
			setDefaultMaterial(value);
		} else if (e.target.name == 'color') {
			setDefaultColor(value);
		}

		if (value == 'All') {
			resetFilters();
		} else {
			setFilters({
				...filters,
				[e.target.name]: value,
			});
		}
	};

	const handleStockChange = (e) => {
		setDefaultStock(e.target.value);

		// Filter products by stock
		if (e.target.value == 'In Stock') {
			setFilteredProducts(products.filter((item) => item.inStock == true));
		} else {
			setFilteredProducts(products.filter((item) => item.inStock == false));
		}
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
										onChange={handleFilters}
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
							{color.length > 0 && (
								<div>
									<span>COLOR:</span>
									<br></br>
									<select
										name="color"
										onChange={handleFilters}
										value={defaultColor}
									>
										<option disabled>COLOR</option>
										<option key="all">All</option>
										{color.map((color) => (
											<option>{color}</option>
										))}
									</select>
								</div>
							)}
							<div className="stock-filters">
								<span>STOCK STATUS:</span>
								<br></br>
								<select
									name="stock"
									onChange={handleStockChange}
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
				<div className="products-title">
					<h1>{name}</h1>
				</div>
				<div className="products-content">
					<div className="sort-container">
						<button
							className="filters-btn-mobile"
							onClick={() => setMobileFiltersOpen(true)}
						>
							Filter by
						</button>
						<select
							onChange={(e) => setSort(e.target.value)}
							className="newest"
						>
							<option value="newest">Newest</option>
							<option value="asc">Price (asc)</option>
							<option value="desc">Price (desc)</option>
						</select>
					</div>
					<div className="products-sort-container">
						<div className="filters-container">
							{material.length > 0 && (
								<div>
									<span>MATERIAL:</span>
									<br></br>
									<select
										name="material"
										onChange={handleFilters}
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
							{color.length > 0 && (
								<div>
									<span>COLOR:</span>
									<br></br>
									<select
										name="color"
										onChange={handleFilters}
										value={defaultColor}
									>
										<option disabled>COLOR</option>
										<option key="all">All</option>
										{color.map((color) => (
											<option>{color}</option>
										))}
									</select>
								</div>
							)}
							<div>
								<span>STOCK STATUS:</span>
								<select
									name="stock"
									value={defaultStock}
									onChange={handleStockChange}
								>
									<option disabled>STOCK STATUS</option>
									<option>In Stock</option>
									<option>Out Of Stock</option>
								</select>
							</div>

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
							<Products products={category ? filteredProducts : products} />
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ProductList;
