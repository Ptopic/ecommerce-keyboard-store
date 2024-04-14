import React, { useState, useEffect, useMemo, useRef } from 'react';
import './ConfiguratorModal.css';

import { motion as m, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';

// Icons
import { AiOutlineClose } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { addFilter } from '../../redux/filtersRedux';

// Components
import ReactSlider from 'react-slider';
import ProductFilters from '../ProductFilters/ProductFilters';
import InputField from '../InputField/InputField';

// Utils
import { regenerateFilters } from '../../utils/filters';
import { generateFilters } from '../../api/http/filters';
import { request } from '../../api';
import { formatPriceDisplay } from '../../utils/formatting';

import { getQueryClient } from '../../shared/queryClient';
import { useGetAllCategories } from '../../../../admin/src/hooks/useGetCategories';
import { addItemToConfiguration } from '../../redux/configuratorRedux';

/**
 * Mode param will define if data is pushed or set into configurator modal values
 * tjst is it singular select or multiple select
 */

const ConfiguratorModal = ({
	configuratorModalValues,
	toggleOpenConfiugratorModal,
	displayType,
	categoryName,
	subCategory,
	mode,
}) => {
	const dispatch = useDispatch();
	const queryClient = getQueryClient;
	let PAGE_SIZE = 40;

	const { data: categories } = useGetAllCategories();

	const [page, setPage] = useState(0);
	const pageDisplay = Number(page) + 1;
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [searchTermValue, setSearchTermValue] = useState('');
	const [search, setSearch] = useState('');
	const searchInputRef = useRef(null);

	// Sorting params
	const [searchParams, setSearchParams] = useSearchParams();
	const sort = searchParams.get('sort');
	const direction = searchParams.get('direction');

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
				minPrice = Math.ceil(pricesData.minPrice[0].price);
				maxPrice = Math.ceil(pricesData.maxPrice[0].price);
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

	const getInitialFilters = async (newCategory) => {
		let curCategory;
		categories?.forEach((category) => {
			if (category['name'] == newCategory) {
				curCategory = category;
			}
		});

		// Set fieldDetails to category details
		if (curCategory != null) {
			// Check if filters exist in query cache
			const filters = queryClient.getQueryData([
				'products',
				'configurator',
				'filters',
				curCategory?.name,
			]);

			const activeFields = queryClient.getQueryData([
				'products',
				'configurator',
				'activeFields',
				curCategory?.name,
			]);

			if (!filters && !activeFields) {
				console.log('Generate filters');
				const generatedFiltersRes = await generateFilters(curCategory?.name);
				const generatedFilters = generatedFiltersRes.data;

				// Set query data
				queryClient.setQueryData(
					['products', 'configurator', 'filters', curCategory?.name],
					generatedFilters?.filters
				);
				queryClient.setQueryData(
					['products', 'configurator', 'activeFields', curCategory?.name],
					generatedFilters?.activeFields
				);
				setFilters(generatedFilters?.filters);
				setActiveFilters(generatedFilters?.activeFields);
			} else {
				setFilters(filters);
				setActiveFilters(activeFields);
			}
		}
	};

	const regenerateNewFilters = async (newActiveFilters) => {
		const generatedFiltersRes = await generateFilters(
			categoryName,
			newActiveFilters
		);
		const generatedFilters = generatedFiltersRes.data;

		// Set query data
		queryClient.setQueryData(
			['products', 'configurator', 'filters', categoryName],
			generatedFilters?.filters
		);
		queryClient.setQueryData(
			['products', 'configurator', 'activeFilters', categoryName],
			generatedFilters?.activeFields
		);
		setFilters(generatedFilters?.filters);
	};

	const getProducts = async (initial) => {
		// Reset page
		if (initial) {
			setPage(0);
		}

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
		// Scroll to top on modal open
		window.scrollTo(0, 0);
		setLoading(true);
		getMinMaxPrices();
		getProducts();
		getInitialFilters(categoryName);

		setLoading(false);
	}, []);

	useEffect(() => {
		let constraints = configuratorModalValues['Constraints'];
		let constraintsArray = Array.of(Object.keys(constraints))[0];

		let doFilterRefresh = false;

		// If there is any constraints map them to active fields
		if (constraintsArray) {
			for (let i = 0; i < constraintsArray.length; i++) {
				for (let j = 0; j < activeFilters.length; j++) {
					if (Object.keys(activeFilters[j])[0] === constraintsArray[i]) {
						activeFilters[j][constraintsArray[i]] =
							constraints[constraintsArray[i]];

						// If constraints array contains categoryName values then regenerate filters
						doFilterRefresh = true;
					}
				}
			}
		}

		getMinMaxPrices();

		if (doFilterRefresh) {
			regenerateNewFilters(activeFilters);
		} else {
			// Check if any value in active filters is != null
			let isActiveFiltersEmpty = true;
			for (let activeFilter of activeFilters) {
				if (Object.values(activeFilter) != '') {
					isActiveFiltersEmpty = false;
				}
			}
			// If it is regenerate filters
			if (!isActiveFiltersEmpty) {
				regenerateNewFilters(activeFilters);
			}
		}
	}, [activeFilters]);

	useEffect(() => {
		getProducts();
	}, [priceSliderValues, sort, direction, page, search]);

	const filterDirectionIcons = (fieldName) => {
		if (sort == fieldName) {
			if (direction == 'asc') {
				return <IoIosArrowDown color="black" size={20} />;
			} else {
				return <IoIosArrowUp color="black" size={20} />;
			}
		} else {
			return <IoIosArrowDown color="black" size={20} />;
		}
	};

	const clearSearchParams = () => {
		// Clear search params
		searchParams.delete('sort');
		searchParams.delete('direction');
		searchParams.delete('search');
		setSearchParams(searchParams);
	};

	const addProductToConfiguration = (product) => {
		dispatch(addItemToConfiguration({ product, categoryName, subCategory }));

		clearSearchParams();
	};

	const closeConfiguratorModal = () => {
		clearSearchParams();

		// Close modal
		toggleOpenConfiugratorModal();
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
						Odaberi {displayType} {subCategory && `- ${subCategory}`}
					</p>
					<button
						className="filters-btn-mobile"
						onClick={() => setMobileFiltersOpen(true)}
					>
						Izbor Filtera
					</button>
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
						refValue={searchInputRef}
					/>
					<button
						type="button"
						className="close-btn"
						onClick={() => closeConfiguratorModal()}
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
									<Link
										to={`/configurator
										?sort=title
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${PAGE_SIZE}
										&search=${search}`}
										className="configurator-products-table-head-cell"
										reloadDocument
									>
										{filterDirectionIcons('title')}
										Naziv
									</Link>
									{/* Display product details keys - for table head */}
									{products &&
										products.length > 0 &&
										Object.keys(products[0].details).map((detail, i) => {
											return (
												<Link
													to={`/configurator
												?sort=${'details.' + detail}
												&direction=${direction == 'asc' ? 'desc' : 'asc'}
												&page=${page}
												&pageSize=${PAGE_SIZE}
												&search=${search}`}
													className="configurator-products-table-head-cell"
													key={i}
												>
													{filterDirectionIcons('details.' + detail)}
													{detail}
												</Link>
											);
										})}
									<Link
										to={`/configurator
										?sort=price
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${PAGE_SIZE}
										&search=${search}`}
										className="configurator-products-table-head-cell"
									>
										{filterDirectionIcons('price')}
										Cijena
									</Link>
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
											key={product._id}
										>
											<div className="configurator-products-table-body-row-cell naziv">
												<img src={product.images[0].url} alt="" />
												<Link to={`/product/${product._id}`}>
													{product.title}
												</Link>
											</div>
											{Object.keys(product.details).map((productDetail, i) => {
												return (
													<div
														className="configurator-products-table-body-row-cell desktop"
														key={i}
													>
														<div className="product-detail">
															<p className="detail-name">{productDetail}</p>
															<p className="detail-value">
																{product.details[productDetail]}
															</p>
														</div>
													</div>
												);
											})}
											<div className="product-details">
												{Object.keys(product.details).map(
													(productDetail, i) => {
														return (
															<div
																className="configurator-products-table-body-row-cell"
																key={i}
															>
																<div className="product-detail">
																	<p className="detail-name">{productDetail}</p>
																	<p className="detail-value">
																		{product.details[productDetail]}
																	</p>
																</div>
															</div>
														);
													}
												)}
											</div>

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
