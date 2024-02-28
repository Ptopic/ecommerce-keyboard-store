import React, { useState, useEffect, useMemo, useRef } from 'react';
import './ConfiguratorModal.css';

import { motion as m, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Icons
import { IoClose } from 'react-icons/io5';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

// Redux
import { useSelector } from 'react-redux/es/hooks/useSelector';

// Components
import ReactSlider from 'react-slider';
import ProductFilters from '../ProductFilters/ProductFilters';
import InputField from '../InputField/InputField';

// Utils
import { generateFilters, regenerateFilters } from '../../utils/filters';
import { request } from '../../api';
import { formatPriceDisplay } from '../../utils/formatting';

/**
 * Mode param will define if data is pushed or set into configurator modal values
 * tjst is it singular select or multiple select
 */

const ConfiguratorModal = ({
	configuratorModalValues,
	setConfiguratorModalValues,
	toggleOpenConfiugratorModal,
	displayType,
	categoryName,
	subCategory,
	mode,
}) => {
	const categories = useSelector((state) => state.categories.data);
	let PAGE_SIZE = 40;

	const [page, setPage] = useState(0);
	const pageDisplay = Number(page) + 1;
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);

	const [sort, setSort] = useState('createdAt');
	const [direction, setDirection] = useState('desc');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [searchTermValue, setSearchTermValue] = useState('');
	const [search, setSearch] = useState('');
	const searchInputRef = useRef(null);

	// Price filters
	const [priceSliderValues, setPriceSliderValues] = useState([0, 0]);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	// Other filters
	const [filters, setFilters] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);

	const getMinMaxPrices = async () => {
		try {
			let minPrice = 0;
			let maxPrice = 0;

			let constraints = configuratorModalValues['Constraints'];

			// Get min max prices of products
			const resPrices = await request.get('/products/prices/' + categoryName, {
				params: {
					activeFilters: activeFilters != [] ? activeFilters : null,
				},
			});
			let pricesData = resPrices.data;

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

	const getProducts = async (initial) => {
		// Reset page
		if (initial) {
			setPage(0);
		}

		let constraints = configuratorModalValues['Constraints'];

		try {
			const res = await request.get(`/products/category/` + categoryName, {
				params: {
					page: initial ? 0 : page,
					pageSize: PAGE_SIZE,
					minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
					maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
					sort: sort != '' ? sort : null,
					direction: direction != '' ? direction : null,
					activeFilters: activeFilters != [] ? activeFilters : null,
					search: search ? search : null,
				},
			});

			let data = res.data;

			console.log(data);

			setProducts(data.data);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load products...');
		}
	};

	const handlePriceFiltersChange = (e) => {
		setPriceSliderValues([e[0], e[1]]);
	};

	// Filter check box click
	const handleFilterCheckboxClick = async (
		filterIndex,
		filterKey,
		curFilterValue,
		newFilterValue
	) => {
		setLoading(true);
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

		// Recalculate prices
		getMinMaxPrices();
		setLoading(false);
	};

	const clearFilters = () => {
		setPriceSliderValues([min, max]);

		let categoryFields = categories.find(
			(category) => category.name === categoryName
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

	useEffect(() => {
		let constraints = configuratorModalValues['Constraints'];

		console.log(constraints);

		for (let constraint of Array.of(Object.keys(constraints))) {
			for (let i = 0; i < activeFilters.length; i++) {
				if (Object.keys(activeFilters[i]).toString() == constraint) {
					activeFilters[i][constraint] = constraints[constraint];
				}
			}
		}
		// Scroll to top on modal open
		window.scrollTo(0, 0);
		setLoading(true);

		getProducts(true);
		generateFilters(
			categoryName,
			activeFilters,
			categories,
			setFilters,
			setActiveFilters,
			constraints
		);

		getMinMaxPrices();
		setLoading(false);
	}, []);

	// Get new prices with useMemo only when activeFilters change
	useMemo(() => {
		let constraints = configuratorModalValues['Constraints'];
		let constraintsArray = Array.of(Object.keys(constraints))[0];
		// console.log(constraintsArray);
		// console.log(constraints);

		for (let i = 0; i < constraintsArray.length; i++) {
			for (let j = 0; j < activeFilters.length; j++) {
				console.log(constraintsArray[i]);
				console.log(Object.keys(activeFilters[j])[0]);
				if (Object.keys(activeFilters[j])[0] === constraintsArray[i]) {
					console.log('hit');
					activeFilters[j][constraintsArray[i]] =
						constraints[constraintsArray[i]];
				}
			}
			// console.log(activeFilters);
		}

		// for (let constraint of Array.of(Object.keys(constraints))) {
		// 	for (let i = 0; i < activeFilters.length; i++) {
		// 		console.log(Object.keys(activeFilters[i])[0] + ' ' + constraint[0]);
		// 		if (Object.keys(activeFilters[i])[0] === constraint[0]) {
		// 			activeFilters[i][constraint] = constraints[constraint];
		// 		}
		// 	}
		// 	console.log(activeFilters);
		// }

		getMinMaxPrices();
		regenerateFilters(
			categoryName,
			activeFilters,
			categories,
			setFilters,
			setActiveFilters,
			constraints
		);
	}, [activeFilters]);

	useEffect(() => {
		getProducts();
	}, [priceSliderValues, sort, direction, page, search]);

	const addProductToConfiguration = (product) => {
		let productDetails = Array.from(Object.keys(product.details));
		let newConfiguratorValue = configuratorModalValues;
		if (
			productDetails.includes('Podnožje') &&
			productDetails.includes('Vrsta Memorije') &&
			productDetails.includes('Veličina')
		) {
			newConfiguratorValue['Constraints']['Podnožje'] =
				product.details['Podnožje'];
			newConfiguratorValue['Constraints']['Vrsta Memorije'] =
				product.details['Vrsta Memorije'];
			newConfiguratorValue['Constraints']['Veličina'] =
				product.details['Veličina'];
		} else if (
			productDetails.includes('Podnožje') ||
			productDetails.includes('Vrsta Memorije') ||
			productDetails.includes('Veličina')
		) {
			if (product.details['Podnožje']) {
				newConfiguratorValue['Constraints']['Podnožje'] =
					product.details['Podnožje'];
			} else if (product.details['Vrsta Memorije']) {
				newConfiguratorValue['Constraints']['Vrsta Memorije'] =
					product.details['Vrsta Memorije'];
			} else {
				newConfiguratorValue['Constraints']['Veličina'] =
					product.details['Veličina'];
			}
		}

		if (subCategory) {
			if (newConfiguratorValue[subCategory] != null) {
				newConfiguratorValue[subCategory] = [
					...Array.from(newConfiguratorValue[subCategory]),
					product,
				];
			} else {
				newConfiguratorValue[subCategory] = [product];
			}
		} else {
			if (newConfiguratorValue[categoryName]) {
				newConfiguratorValue[categoryName] = [
					...Array.from(newConfiguratorValue[categoryName]),
					product,
				];
			} else {
				newConfiguratorValue[categoryName] = [product];
			}
		}
		newConfiguratorValue.displayType = '';
		newConfiguratorValue.categoryName = '';
		newConfiguratorValue.open = false;

		setConfiguratorModalValues({
			...newConfiguratorValue,
		});
	};

	return (
		<div class="modal-overlay">
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
							<button className="clear-filters" onClick={() => clearFilters()}>
								Izbriši Filtere
							</button>
						</div>
					</m.div>
				)}
			</AnimatePresence>

			<div class="configurator-modal">
				<div className="configurator-modal-header">
					<p>
						Odaberi {displayType} - {subCategory}
					</p>
					<InputField
						type={'text'}
						name={'search'}
						placeholder={'Search products'}
						value={searchTermValue}
						onChange={(e) => setSearchTermValue(e.target.value)}
						className="search-field"
						icon={
							<button onClick={(e) => setSearch(searchInputRef.current.value)}>
								<AiOutlineSearch size={32} />
							</button>
						}
						width={'50%'}
						refValue={searchInputRef}
					/>
					<button
						type="button"
						className="close-btn"
						onClick={() => toggleOpenConfiugratorModal()}
					>
						<IoClose size={32} />
					</button>
				</div>
				<div className="configurator-modal-body">
					<div className="configurator-filters-container">
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
						<button className="clear-filters" onClick={(e) => clearFilters(e)}>
							Izbriši Filtere
						</button>
					</div>
					{products.length > 0 ? (
						<div className="configurator-products-container">
							<div className="configurator-products-table">
								<div
									className="configurator-products-table-head"
									style={{
										/* Set header grid columns as number of keys in details object */
										gridTemplateColumns:
											products.length > 0
												? '4fr ' +
												  `repeat(${
														Object.keys(products[0].details).length
												  }, 1fr)` +
												  ' 1.5fr'
												: null,
									}}
								>
									<div className="configurator-products-table-head-cell">
										Naziv
									</div>
									{/* Display product details keys - for table head */}
									{products &&
										products.length > 0 &&
										Object.keys(products[0].details).map((detail) => {
											return (
												<div className="configurator-products-table-head-cell">
													{detail}
												</div>
											);
										})}
									<div className="configurator-products-table-head-cell">
										Cijena
									</div>
								</div>
							</div>

							<div className="configurator-products-table-body">
								{/* Loop thru products and display them as table rows */}
								{products.map((product, i) => {
									return (
										<div
											className="configurator-products-table-body-row"
											style={{
												gridTemplateColumns:
													products.length > 0
														? '4fr ' +
														  `repeat(${
																Object.keys(products[0].details).length
														  }, 1fr)` +
														  ' 1.5fr'
														: null,
											}}
										>
											<div className="configurator-products-table-body-row-cell naziv">
												<img src={product.images[0].url} alt="" />
												<Link to={`/product/${product._id}`}>
													{product.title}
												</Link>
											</div>
											{Object.keys(product.details).map((productDetail) => {
												return (
													<div className="configurator-products-table-body-row-cell">
														{product.details[productDetail]}
													</div>
												);
											})}
											<div className="configurator-products-table-body-row-cell price">
												<p>€{formatPriceDisplay(product.price)}</p>
												<button
													onClick={() => addProductToConfiguration(product)}
												>
													Add
												</button>
											</div>
										</div>
									);
								})}
							</div>

							<div className="pagination-controls">
								{page != 0 && totalPages > 0 && (
									<button
										onClick={() => setPage((prevPage) => prevPage - 1)}
										className="prev-btn"
									>
										<FaChevronLeft />
									</button>
								)}
								<p className="current-page">{pageDisplay}</p>
								{page != totalPages - 1 && totalPages > 0 && (
									<button
										onClick={() => setPage((prevPage) => prevPage + 1)}
										className="next-btn"
									>
										<FaChevronRight />
									</button>
								)}
							</div>
						</div>
					) : (
						<div>No products to show</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConfiguratorModal;
