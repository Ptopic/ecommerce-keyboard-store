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
import { generateFilters } from '../../api/http/filters';
import { regenerateFilters } from '../../utils/filters';

import ProductFilters from '../../components/ProductFilters/ProductFilters';
import { useGetProductPrices } from '../../hooks/useGetProductPrices';
import {
	getInitialProducts,
	getProductPrices,
	getProducts,
} from '../../api/http/products';
import { useGetCategories } from '../../hooks/useGetCategories';
import { useGetInitialProducts } from '../../hooks/useGetInitialProducts';
import { getQueryClient } from '../../shared/queryClient';

const ProductList = () => {
	let PAGE_SIZE = 12;

	const queryClient = getQueryClient;

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
	const [isProductsLoading, setIsProductsLoading] = useState(false);

	const loadMoreBtnRef = useRef(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	const areActiveFiltersEmpty = (activeFilters) => {
		if (activeFilters == [] || activeFilters == null) return true;

		let isEmpty = true;

		activeFilters.forEach((filter) => {
			Object.values(filter).forEach((value) => {
				if (value !== '') {
					isEmpty = false;
				}
			});
		});

		return isEmpty;
	};

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
				minPrice = Math.ceil(pricesData.minPrice[0].price - 1);
				maxPrice = Math.ceil(pricesData.maxPrice[0].price + 1);
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
					activeFilters: areActiveFiltersEmpty(activeFilters)
						? null
						: activeFilters,
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
		setIsProductsLoading(true);

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

	const generateDefaultActiveFilters = () => {
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

	const cacheFilters = async (activeFiltersData) => {
		const filters = queryClient.getQueryData(['products', 'filters', name]);

		if (!filters) {
			console.log('Generate filters');
			const generatedFiltersRes = await generateFilters(
				name,
				activeFiltersData
			);
			const generatedFilters = generatedFiltersRes.data;

			// Set query data
			queryClient.setQueryData(
				['products', 'filters', name],
				generatedFilters.filters
			);

			setFilters(generatedFilters?.filters);
			setActiveFilters(generatedFilters?.activeFields);
		} else {
			setFilters(filters);
			generateDefaultActiveFilters();
		}
	};

	const regenerateNewFilters = async (newActiveFilters) => {
		const generatedFiltersRes = await generateFilters(name, newActiveFilters);
		const generatedFilters = generatedFiltersRes.data;

		setFilters(generatedFilters?.filters);
	};

	// Initial page load and redux state load
	useEffect(() => {
		setIsLoading(true);
		getProductsWithoutDebounce();
		getMinMaxPrices();

		cacheFilters();

		setIsLoading(false);
	}, []);

	useEffect(() => {
		setActiveFilters(null);
		setFilters(null);

		getProductsWithoutDebounce();

		cacheFilters();
	}, [location]);

	useEffect(() => {
		getProductsWithoutDebounce();
	}, [priceSliderValues, sort, direction]);

	useEffect(() => {
		if (areActiveFiltersEmpty(activeFilters) == false) {
			regenerateNewFilters(activeFilters);
		} else {
			// Get filters from cache
			const filters = queryClient.getQueryData(['products', 'filters', name]);
			setFilters(filters);
		}

		getProductsWithoutDebounce();
		getMinMaxPrices();
	}, [activeFilters]);

	return (
		<div className="products-section">
			<Navbar />
			<Toaster />

			{isLoading ? (
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

									{filters && activeFilters && (
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
									{filters && activeFilters && (
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
									<Spinner />
								) : (
									<Products
										products={products}
										title={name}
										setMobileFiltersOpen={setMobileFiltersOpen}
										sort={sort}
										setSort={setSort}
										direction={direction}
										setDirection={setDirection}
									/>
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
