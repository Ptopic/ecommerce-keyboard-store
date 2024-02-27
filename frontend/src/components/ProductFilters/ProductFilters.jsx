import React from 'react';
import '../../pages/ProductList.css';

import { IoMdCheckmark } from 'react-icons/io';

const ProductFilters = ({
	filters,
	activeFilters,
	handleFilterCheckboxClick,
}) => {
	return (
		<>
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
															activeFilters && activeFilters[filterIndex]
														)[0] == filterValue
															? '#E81123'
															: '#fff',
													border:
														Object.values(
															activeFilters && activeFilters[filterIndex]
														) == filterValue
															? 'none'
															: '1px solid black',
												}}
												onClick={() =>
													handleFilterCheckboxClick(
														filterIndex,
														Object.keys(
															activeFilters && activeFilters[filterIndex]
														),
														Object.values(
															activeFilters && activeFilters[filterIndex]
														),
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
		</>
	);
};

export default ProductFilters;
