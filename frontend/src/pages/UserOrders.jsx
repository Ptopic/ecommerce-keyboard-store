import React, { useEffect, useState } from 'react';

import './UserOrders.css';
import './UserDetails.css';
import '../pages/Checkout.css';
import './Login.css';

// Components
import Navbar from '../components/Navbar/Navbar';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// Icons
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

import { userRequest } from '../api';

import { useLocation, useSearchParams } from 'react-router-dom';

function UserOrders() {
	const user = useSelector((state) => state.user.currentUser);
	const [orders, setOrders] = useState([]);
	const [totalPages, setTotalPages] = useState(0);

	const [searchParams, setSearchParams] = useSearchParams();

	// Search params
	const [searchTermValue, setSearchTermValue] = useState(
		searchParams.get('search') == null ? '' : searchParams.get('search')
	);

	const search = searchParams ? searchParams.get('search') : null;

	// Sorting params
	const sort = searchParams.get('sort');
	const direction = searchParams.get('direction');
	const page = searchParams.get('page') == null ? 0 : searchParams.get('page');
	const pageDisplay = Number(page) + 1;
	const pageSize = 5;

	const [sortValue, setSortValue] = useState(sort != null ? sort : '');
	const [directionValue, setDirectionValue] = useState(
		direction != null ? direction : ''
	);

	// Get all orders from user
	const getUsersOrders = async () => {
		try {
			const res = await userRequest.get('/orders/find/' + user._id, {
				params: {
					sort: sortValue,
					direction: directionValue,
					page: page,
					pageSize: pageSize,
					search: searchTermValue,
				},
				headers: { token: user.token },
			});

			res.data.totalPages == 0
				? setTotalPages(0)
				: setTotalPages(res.data.totalPages - 1);

			// Format order dates
			for (let order of res.data.data) {
				let orderDate = order.createdAt.split('T')[0];
				let splittedDate = orderDate.split('-');
				let year;
				let month;
				let day;
				console.log(splittedDate);
				if (splittedDate.length == 3) {
					if (splittedDate[0].length == 1) {
						splittedDate[0] = '0' + splittedDate[0];
					} else if (splittedDate[1].length == 1) {
						splittedDate[1] = '0' + splittedDate[1];
					}

					year = splittedDate[0];
					month = splittedDate[1];
					day = splittedDate[2];
				}
				order['orderDate'] = day + '.' + month + '.' + year;
			}
			setOrders(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		// Get all orders from user
		getUsersOrders();
	}, []);

	// When page changes or page size changes rerender
	useEffect(() => {
		getUsersOrders();
	}, [page, pageSize, sortValue, search, directionValue]);

	const filterDirectionIcons = (fieldName) => {
		if (sort == fieldName) {
			if (direction == 'asc') {
				return <FaSortAlphaDown color="white" size={20} />;
			} else {
				return <FaSortAlphaDownAlt color="white" size={20} />;
			}
		} else {
			return <FaSortAlphaDown color="white" size={20} />;
		}
	};

	const handleSortChange = (e) => {
		let splittedSortString = e.target.value.split('-');

		setSortValue(splittedSortString[0]);
		setDirectionValue(splittedSortString[1]);
	};

	return (
		<div className="user-orders">
			<Navbar />

			<div className="user-orders-container">
				<div className="user-sidebar">
					<Link to={'/user/details'}>Korisnički podaci</Link>

					<Link className="active" to={'/user/orders'}>
						Pregled narudžbi
					</Link>

					<Link to={'/user/changePassword'}>Promjena lozinke</Link>
				</div>

				<div className="user-orders-content">
					<h1>Pregled narudžbi</h1>

					<InputField
						type={'text'}
						name={'search'}
						placeholder={'Search orders by order number or date'}
						value={searchTermValue}
						onChange={(e) => setSearchTermValue(e.target.value)}
						className="search-field"
						icon={
							<Link
								to={`/user/orders${
									searchTermValue
										? `?direction=${direction}
																&page=${0}
																&pageSize=${pageSize}
																&search=${searchTermValue}`
										: ''
								}`}
							>
								<AiOutlineSearch size={32} />
							</Link>
						}
					/>

					<table className="table">
						<thead className="table-head">
							<tr>
								<th>
									<a
										href={`/user/orders
										?sort=orderNumber
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
									>
										<p>Broj narudžbe</p>
										{filterDirectionIcons('orderNumber')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders
										?sort=createdAt
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
									>
										<div className="seperator"></div>
										<p>Datum</p>
										{filterDirectionIcons('createdAt')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders
										?sort=status
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
									>
										<div className="seperator"></div>
										<p>Status</p>
										{filterDirectionIcons('status')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders
										?sort=amount
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
									>
										<div className="seperator"></div>
										<p>Ukupno</p>
										{filterDirectionIcons('amount')}
									</a>
								</th>
								<th>
									<a>
										<div className="seperator"></div>
										<p>Link</p>
									</a>
								</th>
							</tr>
						</thead>

						<tbody className="table-content">
							{orders.map((order) => (
								<tr className="table-content-row" key={order.orderNumber}>
									<td>{order.orderNumber}</td>
									<td>{order.orderDate}</td>
									<td>{order.status}</td>
									<td>€{order.amount}</td>
									<td>
										<Link to={'/order/' + order._id}>Detalji</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Mobile cards display instead of table */}
					<div className="mobile-orders-container">
						<div className="user-orders-sort">
							<p>Sortiraj prema:</p>
							<select
								onChange={(e) => handleSortChange(e)}
								className="newest"
								value={sort + '-' + direction}
							>
								<option value="orderNumber-asc">Broj Narudžbe - Rastuće</option>
								<option value="orderNumber-desc">
									Broj Narudžbe - Padajuće
								</option>
								<option value="createdAt-asc">Datum - Rastuće</option>
								<option value="createdAt-desc">Datum - Padajuće</option>
								<option value="status-asc">Status - Rastuće</option>
								<option value="status-desc">Status - Padajuće</option>
								<option value="amount-asc">Ukupno - Rastuće</option>
								<option value="amount-desc">Ukupno - Padajuće</option>
							</select>
						</div>
						<div className="order-cards-container">
							{orders.map((order) => (
								<div className="order-card">
									<div className="order-card-top">
										<div className="order-card-amount">
											<div>
												<p>Ukupno</p>
												<h2>€{order.amount}</h2>
											</div>
											<div>{order.status}</div>
										</div>
									</div>
									<div className="order-card-content">
										<div className="order-card-content-row">
											<h2 className="order-row-category">Broj narudžbe</h2>
											<h3 className="order-row-value">{order.orderNumber}</h3>
										</div>
										<div className="order-card-content-row">
											<h2 className="order-row-category">Datum</h2>
											<h3 className="order-row-value">{order.orderDate}</h3>
										</div>
									</div>
									<div className="order-card-footer">
										<Link to={'/order/' + order._id}>Detalji</Link>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="pagination-controls">
						{page != 0 && totalPages > 0 && (
							<Link
								className="prev-btn"
								to={`/user/orders
								?page=${Number(page) - 1}
								&pageSize=${pageSize}
								${sort != null ? '&sort=' + sort : ''}
								${direction != null ? '&direction=' + direction : ''}
								${searchTermValue != null ? '&search=' + searchTermValue : ''}
								`}
							>
								<FaChevronLeft />
							</Link>
						)}
						<p className="current-page">{pageDisplay}</p>
						{page != totalPages && totalPages > 0 && (
							<Link
								className="next-btn"
								to={`/user/orders
								?page=${Number(page) + 1}
								&pageSize=${pageSize}
								${sort != null ? '&sort=' + sort : ''}
								${direction != null ? '&direction=' + direction : ''}
								${searchTermValue != null ? '&search=' + searchTermValue : ''}
								`}
							>
								<FaChevronRight />
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserOrders;
