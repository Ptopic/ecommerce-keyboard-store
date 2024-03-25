import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Products from '../../components/Products/Products';
import Footer from '../../components/Footer/Footer';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './ProductList.css';
import { request } from '../../api';
import ReactSlider from 'react-slider';
import { motion as m, AnimatePresence } from 'framer-motion';

import Spinner from '../../components/Spinner/Spinner';
import { toast, Toaster } from 'react-hot-toast';

// Styles for input boxes
import '../Checkout/Checkout.css';

// Utils
import { debounce } from '../../utils/debounce';
import { generateFilters, regenerateFilters } from '../../utils/filters';

import ProductFilters from '../../components/ProductFilters/ProductFilters';
import { useGetProductPrices } from '../../hooks/useGetProductPrices';
import {
	getInitialProducts,
	getProductPrices,
	getProducts,
} from '../../api/http/products';
import { useGetCategories } from '../../hooks/useGetCategories';
import { useGetInitialProducts } from '../../hooks/useGetInitialProducts';

const ProductList = () => {
	let PAGE_SIZE = 12;

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

	const { data: categories } = useGetCategories();

	const [products, setProducts] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const loadMoreBtnRef = useRef(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [isProductsLoading, setIsProductsLoading] = useState(false);

	const getMinMaxPrices = async () => {
		try {
			let minPrice = 0;
			let maxPrice = 0;
			// Get min max prices of products
			const data = await request.get('/products/prices/' + category, {
				params: {
					activeFilters: activeFilters != [] ? activeFilters : null,
				},
			});
			let pricesData = data.data;

			if (
				pricesData &&
				pricesData.minPrice.length > 0 &&
				pricesData.maxPrice.length > 0
			) {
				minPrice = pricesData.minPrice[0].price;
				maxPrice = pricesData.maxPrice[0].price;
			} else {
				minPrice = 0;
				maxPrice = 0;
			}
			setMin(minPrice);
			setMax(maxPrice);
			setPriceSliderValues([minPrice, maxPrice]);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load prices...');
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
			toast.error('Failed to load products...');
		}
	};

	const getProducts = debounce(async () => {
		// Reset page
		setPage(0);

		try {
			setIsProductsLoading(true);
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
			setIsProductsLoading(false);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load products...');
		}
	}, 2000);

	const loadMoreData = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			let data;
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
			setProducts((prev) => [...prev, ...data.data]);
			setPage((prevPage) => prevPage + 1);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load more products...');
		}
	};

	const handlePriceFiltersChange = (e) => {
		setPriceSliderValues([e[0], e[1]]);
		getProducts();
	};

	// Filter check box click
	const handleFilterCheckboxClick = (
		filterIndex,
		filterKey,
		curFilterValue,
		newFilterValue
	) => {
		// If new filter value is equal to current filter value then remove current value
		let updatedFilters = activeFilters.map((filter) => {
			return { ...filter };
		});

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
	};

	const clearFilters = () => {
		setPriceSliderValues([min, max]);

		let categoryFields = categories?.data.find(
			(category) => category.name === name
		)?.fields;

		let initialFiltersArray = [];

		if (categoryFields) {
			for (let filter of categoryFields) {
				let initialFilter = {};
				initialFilter[filter.name] = '';
				initialFiltersArray.push(initialFilter);
			}
		}

		setActiveFilters(initialFiltersArray);
	};

	const cacheFilters = () => {
		generateFilters(
			name,
			activeFilters,
			categories?.data,
			setFilters,
			setActiveFilters
		)
			.then((res) => {})
			.catch((err) => console.log(err));
	};

	// Initial page load and redux state load
	useEffect(() => {
		setIsLoading(true);
		getMinMaxPrices();
		getProductsWithoutDebounce();

		cacheFilters();

		setIsLoading(false);
	}, [categories]);

	useEffect(() => {
		getProductsWithoutDebounce();

		cacheFilters();
	}, [location]);

	useEffect(() => {
		getProducts();
	}, [priceSliderValues, sort, direction]);

	useEffect(() => {
		if (activeFilters.length > 0) {
			getMinMaxPrices();

			getProducts();

			regenerateFilters(
				name,
				activeFilters,
				categories?.data,
				setFilters,
				setActiveFilters
			);
		}
	}, [activeFilters]);

	return (
		<div className="products-section">
			<Navbar />
			<Toaster />

			{isLoading == true ? (
				<div className="product-list-spinner-container">
					<Spinner />
				</div>
			) : (
				<>
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

									{filters.length !== 0 &&
										filters != null &&
										activeFilters.length !== 0 &&
										activeFilters != null && (
											<ProductFilters
												filters={filters}
												activeFilters={activeFilters}
												handleFilterCheckboxClick={handleFilterCheckboxClick}
											/>
										)}

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
										onClick={() => clearFilters()}
									>
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
									{filters.length !== 0 &&
										filters != null &&
										activeFilters.length !== 0 &&
										activeFilters != null && (
											<ProductFilters
												filters={filters}
												activeFilters={activeFilters}
												handleFilterCheckboxClick={handleFilterCheckboxClick}
											/>
										)}
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
								{isProductsLoading ? (
									<div className="spinner-container">
										<Spinner />
									</div>
								) : (
									<>
										{products.length > 0 ? (
											<Products
												products={products}
												title={name}
												setMobileFiltersOpen={setMobileFiltersOpen}
												sort={sort}
												setSort={setSort}
												direction={direction}
												setDirection={setDirection}
											/>
										) : (
											<h2>No products to show...</h2>
										)}

										<div className="has-more-container" ref={loadMoreBtnRef}>
											{totalPages != page && products.length > 0 ? (
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
				</>
			)}

			<Footer />
		</div>
	);
};

export default ProductList;
