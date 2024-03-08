import React from 'react';

import { Link } from 'react-router-dom';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaginationControls = ({
	state,
	page,
	setPage,
	totalPages,
	pageSize,
	sort,
	direction,
	searchTermValue,
	categoryName,
}) => {
	let pageDisplay = Number(page) + 1;
	return (
		<div className="pagination-controls">
			{state ? (
				<div className="pagination-controls">
					{page != 0 && totalPages > 0 && (
						<button
							type="button"
							className="prev-btn"
							onClick={() => setPage(Number(page) - 1)}
						>
							<FaChevronLeft />
						</button>
					)}
					<p className="current-page">{pageDisplay}</p>
					{page != totalPages && totalPages > 0 && (
						<button
							type="button"
							className="next-btn"
							onClick={() => setPage(Number(page) + 1)}
						>
							<FaChevronRight />
						</button>
					)}
				</div>
			) : (
				<div className="pagination-controls">
					{page != 0 && totalPages > 0 && (
						<Link
							className="prev-btn"
							to={`/${categoryName}?page=${
								Number(page) - 1
							}&pageSize=${pageSize}${sort != null ? '&sort=' + sort : ''}${
								direction != null ? '&direction=' + direction : ''
							}
                        ${
													searchTermValue != null
														? '&search=' + searchTermValue
														: ''
												}
                         `}
						>
							<FaChevronLeft />
						</Link>
					)}
					<p className="current-page">{pageDisplay}</p>
					{page != totalPages && totalPages > 0 && (
						<Link
							className="next-btn"
							to={`/${categoryName}?page=${
								Number(page) + 1
							}&pageSize=${pageSize}${sort != null ? '&sort=' + sort : ''}${
								direction != null ? '&direction=' + direction : ''
							}
                  ${searchTermValue != null ? '&search=' + searchTermValue : ''}
                  `}
						>
							<FaChevronRight />
						</Link>
					)}
				</div>
			)}
		</div>
	);
};

export default PaginationControls;
