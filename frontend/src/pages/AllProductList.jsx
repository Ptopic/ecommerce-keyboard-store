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
import toast, { Toaster } from 'react-hot-toast';

// Utils
import { debounce } from '../utils/debounce';

const AllProductList = () => {
	let PAGE_SIZE = 6;
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);

	const [sort, setSort] = useState('createdAt');
	const [direction, setDirection] = useState('desc');

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const [priceSliderValues, setPriceSliderValues] = useState([0, 0]);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	const getMinMaxPrices = async () => {
		try {
			let minPrice = 0;
			let maxPrice = 0;
			// Get min max prices of products
			const resPrices = await request.get('/products/prices/all');
			let pricesData = resPrices.data;
			if (
				pricesData != null &&
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

	const getProducts = debounce(async () => {
		// Reset page
		setPage(0);

		console.log(sort);
		try {
			setLoading(true);
			const res = await request.get(`/products/all`, {
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
			setLoading(false);
			setPage(1);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load products...');
		}
	}, 1200);

	const loadMoreData = async () => {
		try {
			let data;
			setLoading(true);
			const res = await request.get(`/products/all`, {
				params: {
					page: page,
					pageSize: PAGE_SIZE,
					minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
					maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
					sort: sort != '' ? sort : null,
					direction: direction != '' ? direction : direction,
				},
			});
			data = res.data;
			setLoading(false);
			setProducts((prev) => [...prev, ...data.data]);
			setPage((prevPage) => prevPage + 1);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.log(error);
			toast.error('Failed to load more products...');
		}
	};

	useEffect(() => {
		getMinMaxPrices();
		getProducts();
	}, []);

	const handlePriceFiltersChange = (e) => {
		setPriceSliderValues([e[0], e[1]]);
	};

	useEffect(() => {
		getProducts();
	}, [priceSliderValues, sort, direction]);

	const clearFilters = () => {
		setPriceSliderValues([min, max]);
	};

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
								<button
									className="clear-filters"
									onClick={() => clearFilters()}
								>
									Izbriši Filtere
								</button>
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
									title={'Svi Proizvodi'}
									setMobileFiltersOpen={setMobileFiltersOpen}
									sort={sort}
									setSort={setSort}
									direction={direction}
									setDirection={setDirection}
								/>
								<div className="has-more-container">
									{totalPages != page ? (
										<button
											className="load-more-btn"
											onClick={(e) => loadMoreData()}
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

export default AllProductList;
