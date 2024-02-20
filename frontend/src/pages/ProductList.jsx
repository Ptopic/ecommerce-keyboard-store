import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Products from '../components/Products/Products';
import Footer from '../components/Footer/Footer';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './ProductList.css';
import { request } from '../api';
import ReactSlider from 'react-slider';
import { motion as m, AnimatePresence } from 'framer-motion';

import Spinner from '../components/Spinner/Spinner';
import { toast, Toaster } from 'react-hot-toast';

// Styles for input boxes
import '../pages/Checkout.css';

// Redux
import { useSelector } from 'react-redux/es/hooks/useSelector';

// Utils
import { debounce } from '../utils/debounce';
import { Checkbox } from '@mui/material';

import { IoMdCheckmark } from 'react-icons/io';

const ProductList = () => {
	const categories = useSelector((state) => state.categories.data);
	let PAGE_SIZE = 12;

	const navigate = useNavigate();
	const loadMoreBtnRef = useRef(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);

	const [searchParams] = useSearchParams();
	const location = useLocation();
	const category = location.pathname.split('/')[2];
	const name = searchParams.get('name');

	const [sort, setSort] = useState('createdAt');
	const [direction, setDirection] = useState('desc');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	// Price filters
	const [priceSliderValues, setPriceSliderValues] = useState([0, 0]);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	// Other filters
	const [filters, setFilters] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);

	const generateFilters = async () => {
		// Get all products by category to generate filters for it
		const allProductsRes = await request.get(`/products/filters/` + name, {
			params: {
				activeFilters: activeFilters != [] ? activeFilters : null,
			},
		});

		let productsData = allProductsRes.data.data;

		let categoryFields = categories.find(
			(category) => category.name === name
		).fields;

		let filtersArray = [];
		let initialFiltersArray = [];

		if (initialFiltersArray.length == 0) {
			for (let filter of categoryFields) {
				let obj = {};
				let initialFilter = {};
				obj[filter.name] = new Set([]);
				initialFilter[filter.name] = '';
				filtersArray.push(obj);
				initialFiltersArray.push(initialFilter);
			}
		}

		setActiveFilters(initialFiltersArray);

		for (let product of productsData) {
			// Loop thru all products details
			for (let i = 0; i < categoryFields.length; i++) {
				let filterName = categoryFields[i].name;

				let productFilter = product.details[filterName.toString()];

				let filterSet = filtersArray[i][filterName.toString()];

				filterSet.add(productFilter);
			}
		}

		// Loop thru all filters to sort its sets
		for (let j = 0; j < filtersArray.length; j++) {
			let curSet = Object.values(filtersArray[j])[0];

			// Sort filter set
			let sortedArrayFromSet = Array.from(curSet).sort();

			curSet.clear();

			// Add sorted values back into set
			for (let value of sortedArrayFromSet) {
				curSet.add(value);
			}
		}

		setFilters(filtersArray);

		// Cache filters for current category in redux persist
	};

	const regenerateFilters = async () => {
		// Get all products by category to generate filters for it
		const allProductsRes = await request.get(`/products/filters/` + name, {
			params: {
				activeFilters: activeFilters != [] ? activeFilters : null,
			},
		});

		console.log(allProductsRes);

		let productsData = allProductsRes.data.data;

		let categoryFields = categories.find(
			(category) => category.name === name
		).fields;

		let filtersArray = [];

		for (let filter of categoryFields) {
			let obj = {};
			obj[filter.name] = new Set([]);
			filtersArray.push(obj);
		}

		for (let product of productsData) {
			// Loop thru all products details
			for (let i = 0; i < categoryFields.length; i++) {
				let filterName = categoryFields[i].name;

				let productFilter = product.details[filterName.toString()];

				let filterSet = filtersArray[i][filterName.toString()];

				filterSet.add(productFilter);
			}
		}

		// Loop thru all filters to sort its sets
		for (let j = 0; j < filtersArray.length; j++) {
			let curSet = Object.values(filtersArray[j])[0];

			// Sort filter set
			let sortedArrayFromSet = Array.from(curSet).sort();

			curSet.clear();

			// Add sorted values back into set
			for (let value of sortedArrayFromSet) {
				curSet.add(value);
			}
		}

		console.log(filtersArray);
		setFilters(filtersArray);
	};

	const getMinMaxPrices = async () => {
		try {
			let minPrice = 0;
			let maxPrice = 0;
			// Get min max prices of products
			const resPrices = await request.get('/products/prices/' + category, {
				params: {
					activeFilters: activeFilters != [] ? activeFilters : null,
				},
			});
			let pricesData = resPrices.data;
			console.log(pricesData);
			if (pricesData && pricesData.minPrice && pricesData.maxPrice) {
				minPrice = pricesData.minPrice[0].price;
				maxPrice = pricesData.maxPrice[0].price;
			}
			setMin(minPrice);
			setMax(maxPrice);
			setPriceSliderValues([minPrice, maxPrice]);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong...');
		}
	};

	const getProductsWithoutDebounce = async () => {
		// Reset page
		setPage(0);

		try {
			const res = await request.get(`/products/category/` + category, {
				params: {
					page: 0,
					pageSize: PAGE_SIZE,
					minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
					maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
					sort: sort != '' ? sort : null,
					direction: direction != '' ? direction : null,
				},
			});

			let data = res.data;

			setProducts(data.data);
			setPage(1);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong...');
		}
	};

	const getProducts = debounce(async () => {
		// Reset page
		setPage(0);

		try {
			const res = await request.get(`/products/category/` + category, {
				params: {
					page: 0,
					pageSize: PAGE_SIZE,
					minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
					maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
					sort: sort != '' ? sort : null,
					direction: direction != '' ? direction : null,
					activeFilters: activeFilters != [] ? activeFilters : null,
				},
			});

			let data = res.data;

			setProducts(data.data);
			setPage(1);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong...');
		}
	}, 2000);

	const loadMoreData = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			let data;
			setLoading(true);
			const res = await request.get(`/products/category/` + category, {
				params: {
					page: page,
					pageSize: PAGE_SIZE,
					minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
					maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
					sort: sort != '' ? sort : null,
					direction: direction != '' ? direction : direction,
					activeFilters: activeFilters != [] ? activeFilters : null,
				},
			});
			data = res.data;
			setLoading(false);
			setProducts((prev) => [...prev, ...data.data]);
			setPage((prevPage) => prevPage + 1);
			setTotalPages(data.totalPages);

			// Scroll load more btn in view
			loadMoreBtnRef.current.scrollIntoView();
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong...');
		}
	};

	const handlePriceFiltersChange = (e) => {
		setPriceSliderValues([e[0], e[1]]);
	};

	// Filter check box click
	const handleFilterCheckboxClick = (
		filterIndex,
		filterKey,
		curFilterValue,
		newFilterValue
	) => {
		setLoading(true);
		console.log('Started');
		// If new filter value is equal to current filter value then remove current value
		let updatedFilters = [...activeFilters];
		if (newFilterValue == curFilterValue) {
			// Reset filter value
			updatedFilters[filterIndex][filterKey] = '';
		} else {
			// Update the state with the new filters
			updatedFilters[filterIndex][filterKey] = newFilterValue;
		}

		setActiveFilters(updatedFilters);

		// Trigger filters re render
		setFilters([...filters]);

		// Get new products
		getProducts();

		// // Regenerate filters
		// generateFilters();

		// Recalculate prices
		getMinMaxPrices();
		console.log('Finished');
		setLoading(false);
	};

	const clearFilters = () => {
		setPriceSliderValues([min, max]);

		let categoryFields = categories.find(
			(category) => category.name === name
		).fields;

		let initialFiltersArray = [];

		for (let filter of categoryFields) {
			let initialFilter = {};
			initialFilter[filter.name] = '';
			initialFiltersArray.push(initialFilter);
		}

		setActiveFilters(initialFiltersArray);
	};

	useEffect(() => {
		setLoading(true);
		getMinMaxPrices();
		getProductsWithoutDebounce();
		setLoading(false);
	}, []);

	// Get new prices with useMemo only when activeFilters change
	useMemo(() => {
		getMinMaxPrices();
		regenerateFilters();
	}, [activeFilters]);

	// If category changes refetch data
	// If products array changes generate filters (initial load or load more data) or location changes
	useEffect(() => {
		// Reset filters and active filters
		clearFilters();

		// getMinMaxPrices();
		getProductsWithoutDebounce();
		generateFilters();
	}, [location]);

	useEffect(() => {
		getProducts();
	}, [priceSliderValues, sort, direction]);

	return (
		<div className="products-section">
			<Navbar />
			<Toaster />

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
								<p className="filters-header">IZBOR FILTERA</p>
								<AiOutlineClose
									size={26}
									onClick={() => setMobileFiltersOpen(false)}
								/>
							</div>
							<div className="filters-devider"></div>

							{filters.map((filter, filterIndex) => {
								return (
									<div className="filter">
										<div className="filter-name">{Object.keys(filter)}:</div>
										<div className="filter-values">
											{Object.values(filter).map((el) => {
												return Array.from(el).map((filterValue) => {
													return (
														<div className="checkout-checkbox">
															<button
																type="button"
																style={{
																	background:
																		Object.values(
																			activeFilters[filterIndex]
																		)[0] == filterValue
																			? '#E81123'
																			: '#fff',
																	border:
																		Object.values(activeFilters[filterIndex]) ==
																		filterValue
																			? 'none'
																			: '1px solid black',
																}}
																onClick={() =>
																	handleFilterCheckboxClick(
																		filterIndex,
																		Object.keys(activeFilters[filterIndex]),
																		Object.values(activeFilters[filterIndex]),
																		filterValue
																	)
																}
															>
																{activeFilters[Object.keys(filter)[0]] != '' ? (
																	<IoMdCheckmark color={'white'} size={24} />
																) : null}
															</button>
															<p>{filterValue}</p>
														</div>
													);
												});
											})}
										</div>
									</div>
								);
							})}

							<div className="price-filters">
								<span className="filter-name">CIJENA:</span>
								<div className="price-ranges current">
									<p>€{priceSliderValues[0]}</p>
									<p>€{priceSliderValues[1]}</p>
								</div>
								<ReactSlider
									className="slider"
									value={priceSliderValues}
									onChange={(e) => handlePriceFiltersChange(e)}
									min={min}
									max={max}
								/>
								<div className="price-ranges">
									<p>€{min}</p>
									<p>€{max}</p>
								</div>
							</div>
							<button className="clear-filters" onClick={() => clearFilters()}>
								Izbriši Filtere
							</button>
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
							{filters.map((filter, filterIndex) => {
								return (
									<div className="filter" key={filterIndex}>
										<div className="filter-name">{Object.keys(filter)}:</div>
										<div className="filter-values">
											{Object.values(filter).map((el, id) => {
												return Array.from(el).map((filterValue) => {
													return (
														<div className="checkout-checkbox">
															<button
																type="button"
																style={{
																	background:
																		Object.values(
																			activeFilters[filterIndex]
																		)[0] == filterValue
																			? '#E81123'
																			: '#fff',
																	border:
																		Object.values(activeFilters[filterIndex]) ==
																		filterValue
																			? 'none'
																			: '1px solid black',
																}}
																onClick={() =>
																	handleFilterCheckboxClick(
																		filterIndex,
																		Object.keys(activeFilters[filterIndex]),
																		Object.values(activeFilters[filterIndex]),
																		filterValue
																	)
																}
															>
																{activeFilters[Object.keys(filter)[0]] != '' ? (
																	<IoMdCheckmark color={'white'} size={24} />
																) : null}
															</button>
															<p>{filterValue}</p>
														</div>
													);
												});
											})}
										</div>
									</div>
								);
							})}
							<div className="price-filters">
								<span className="filter-name">CIJENA:</span>
								<div className="price-ranges current">
									<p>€{priceSliderValues[0]}</p>
									<p>€{priceSliderValues[1]}</p>
								</div>
								<ReactSlider
									className="slider"
									value={priceSliderValues}
									onChange={(e) => handlePriceFiltersChange(e)}
									min={min}
									max={max}
								/>
								<div className="price-ranges">
									<p>€{min}</p>
									<p>€{max}</p>
								</div>
							</div>
							<button
								className="clear-filters"
								onClick={(e) => clearFilters(e)}
							>
								Izbriši Filtere
							</button>
						</div>
						{loading ? (
							<div className="spinner-container">
								<Spinner />
							</div>
						) : (
							<>
								<Products
									products={products}
									title={name}
									setMobileFiltersOpen={setMobileFiltersOpen}
									sort={sort}
									setSort={setSort}
									direction={direction}
									setDirection={setDirection}
								/>
								<div className="has-more-container" ref={loadMoreBtnRef}>
									{totalPages != page ? (
										<button
											className="load-more-btn"
											onClick={(e) => loadMoreData(e)}
										>
											Prikaži više
											<span>
												(str. {page}/{totalPages})
											</span>
										</button>
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
