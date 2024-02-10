import React, { useEffect, useState } from 'react';

import './UserOrders.css';
import './UserDetails.css';
import '../pages/Checkout.css';
import './Login.css';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

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

	// Sorting params
	const sort = searchParams.get('sort');
	const direction = searchParams.get('direction');
	const page = searchParams.get('page') == null ? 0 : searchParams.get('page');
	const pageDisplay = Number(page) + 1;
	const pageSize = 5;

	// Get all orders from user

	const getUsersOrders = async () => {
		const res = await userRequest.get('/orders/find/' + user.data._id, {
			params: {
				sort: sort,
				direction: direction,
				page: page,
				pageSize: pageSize,
				search: searchTermValue,
			},
			headers: { token: user.token },
		});

		res.data.totalPages == 0
			? setTotalPages(0)
			: setTotalPages(res.data.totalPages - 1);
		setOrders(res.data.data);
	};
	useEffect(() => {
		// Get all orders from user
		getUsersOrders();
	}, []);

	// When page changes or page size changes rerender
	useEffect(() => {
		getUsersOrders();
	}, [page, pageSize, searchTermValue, sort, direction]);

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

					<Formik enableReinitialize>
						{() => (
							<Form>
								<InputField
									type={'text'}
									name={'search'}
									placeholder={'Search orders by order number'}
									value={searchTermValue}
									onChange={(e) => setSearchTermValue(e.target.value)}
									width={'50%'}
									icon={
										<Link
											to={`/user/orders
													&direction=${direction}
													&page=${page}
													&pageSize=${pageSize}
													&search=${searchTermValue}`}
										>
											<AiOutlineSearch size={32} />
										</Link>
									}
								/>
							</Form>
						)}
					</Formik>

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
									<td>{order.createdAt.split('T')[0]}</td>
									<td>{order.status}</td>
									<td>€{order.amount}</td>
									<td>
										<Link to={'/order/' + order._id}>Detalji</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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
