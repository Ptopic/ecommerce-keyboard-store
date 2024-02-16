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

const ProductList = () => {
	const [page, setPage] = useState(1);
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
			if ((defaultColor || defaultMaterial) && min && max) {
				if (defaultColor != 'All' && defaultColor != null) {
					const res = await request.get(
						`/products?category=${category}&sort=${sort}&color=${defaultColor}&min=${min}&max=${max}`
					);
					data = res.data;
				} else if (defaultMaterial != 'All' && defaultMaterial != null) {
					const res = await request.get(
						`/products?category=${category}&sort=${sort}&material=${defaultMaterial}&min=${min}&max=${max}`
					);
					data = res.data;
				} else {
					console.log('all');
					const res = await request.get(
						`/products?category=${category}&sort=${sort}&min=${min}&max=${max}`
					);
					data = res.data;
				}
			} else if (
				(defaultColor || defaultMaterial) &&
				defaultStock &&
				min &&
				max
			) {
			} else if (defaultColor || defaultMaterial) {
				if (defaultColor != 'All' && defaultColor != null) {
					const res = await request.get(
						`/products?category=${category}&sort=${sort}&color=${defaultColor}`
					);
					data = res.data;
				} else if (defaultMaterial != 'All' && defaultMaterial != null) {
					const res = await request.get(
						`/products?category=${category}&sort=${sort}&material=${defaultMaterial}`
					);
					data = res.data;
				} else {
					const res = await request.get(
						`/products?category=${category}&sort=${sort}`
					);
					data = res.data;
				}
			} else if (min && max) {
				const res = await request.get(
					`/products?category=${category}&sort=${sort}`
				);
				data = res.data;
			} else {
				const res = await request.get(
					`/products?category=${category}&sort=${sort}`
				);
				data = res.data;
			}
			setLoading(false);
			if (products.length == 0) {
				generateFilters(data);
			}
			setProducts(data.data);
			setPage((prevPage) => prevPage + 1);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchMoreData = async () => {
		try {
			let data;
			if (sort && defaultColor != null && defaultMaterial != null) {
				if (defaultColor) {
					if (sort == 'newest') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}`
						);
						data = res.data;
					} else if (sort === 'asc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}`
						);
						data = res.data;
					} else if (sort === 'desc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}`
						);
						data = res.data;
					}
				} else if (defaultStock) {
					if (sort == 'newest') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&stock=${defaultStock}`
						);
						data = res.data;
					} else if (sort === 'asc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&stock=${defaultStock}`
						);
						data = res.data;
					} else if (sort === 'desc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&stock=${defaultStock}`
						);
						data = res.data;
					}
				} else if (defaultColor && defaultStock) {
					if (sort == 'newest') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}&stock=${defaultStock}`
						);
						data = res.data;
					} else if (sort === 'asc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}&stock=${defaultStock}`
						);
						data = res.data;
					} else if (sort === 'desc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&color=${defaultColor}&stock=${defaultStock}`
						);
						data = res.data;
					}
				} else {
					if (sort == 'newest') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&material=${defaultMaterial}`
						);
						data = res.data;
					} else if (sort === 'asc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&material=${defaultMaterial}`
						);
						data = res.data;
					} else if (sort === 'desc') {
						const res = await request.get(
							`/products?category=${category}&page=${page}&sort=${sort}&material=${defaultMaterial}`
						);
						data = res.data;
					}
				}
			} else if (sort) {
				if (sort == 'newest') {
					const res = await request.get(
						`/products?category=${category}&page=${page}&sort=${sort}`
					);
					data = res.data;
				} else if (sort === 'asc') {
					const res = await request.get(
						`/products?category=${category}&page=${page}&sort=${sort}`
					);
					data = res.data;
				} else if (sort === 'desc') {
					const res = await request.get(
						`/products?category=${category}&page=${page}&sort=${sort}`
					);
					data = res.data;
				}
			}
			if (data.data.length == 0) {
				setHasMore(false);
			} else {
				setProducts((prev) => [...prev, ...data.data]);
				setPage((prevPage) => prevPage + 1);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const resetFilters = () => {
		setPage(1);
		setHasMore(true);
	};

	const onIntersection = (entries) => {
		const firstEntry = entries[0];
		if (firstEntry.isIntersecting && hasMore) {
			fetchMoreData();
			console.log('intersecting');
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(onIntersection);
		if (observer && loadRef.current) {
			observer.observe(loadRef.current);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [products]);

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
							{color.length > 0 && (
								<div>
									<span>COLOR:</span>
									<br></br>
									<select
										name="color"
										onChange={(e) => setDefaultColor(e.target.value)}
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
				<div className="products-title">
					<h1>{name}</h1>
				</div>
				<div className="products-content">
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
							{color.length > 0 && (
								<div>
									<span>COLOR:</span>
									<br></br>
									<select
										name="color"
										onChange={(e) => setDefaultColor(e.target.value)}
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
									onChange={(e) => setDefaultStock(e.target.value)}
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
							<>
								<Products products={products} />
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

export default ProductList;
