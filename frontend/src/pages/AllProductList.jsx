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
	let PAGE_SIZE = 6;
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	const [products, setProducts] = useState([]);
	const [sort, setSort] = useState('newest');
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const getInitialProducts = async () => {
		try {
			let data;
			setLoading(true);
			const res = await request.get(`/products`, {
				params: {
					page: page,
					pageSize: PAGE_SIZE,
				},
			});
			data = res.data;
			console.log(data);
			setLoading(false);
			// if (products.length == 0) {
			// 	generateFilters(data);
			// }
			setProducts(data.data);
			setPage((prevPage) => prevPage + 1);
			setTotalPages(data.totalPages);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getInitialProducts();
	}, []);

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

							<div className="price-filters">
								<span>PRICE:</span>
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
							<div>
								<span>PRICE:</span>
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
									{totalPages != page ? (
										<button className="load-more-btn">
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
