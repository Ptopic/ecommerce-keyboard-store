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
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// Icons
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { userRequest } from '../api';

import { useLocation, useSearchParams } from 'react-router-dom';

function UserOrders() {
	const user = useSelector((state) => state.user.currentUser);
	const [orders, setOrders] = useState([]);

	// Sorting params
	const [searchParams, setSearchParams] = useSearchParams();
	const sort = searchParams.get('sort');
	const direction = searchParams.get('direction');

	console.log(sort, direction);

	// Get all orders from user

	const getUsersOrders = async () => {
		const res = await userRequest.get('/orders/find/' + user.data._id, {
			params: {
				sort: sort,
				direction: direction,
			},
			headers: { token: user.token },
		});
		setOrders(res.data.data);
	};
	useEffect(() => {
		// Get all orders from user
		getUsersOrders();
	}, []);

	const filterDirectionIcons = (fieldName) => {
		if (sort == fieldName) {
			if (direction == 'asc') {
				return <FaSortAlphaDown color="white" />;
			} else {
				return <FaSortAlphaDownAlt color="white" />;
			}
		} else {
			return <FaSortAlphaDown color="white" />;
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

					<table className="table">
						<thead className="table-head">
							<tr>
								<th>
									<a
										href={`/user/orders?sort=orderNumber&direction=${
											direction == 'asc' ? 'desc' : 'asc'
										}`}
									>
										<p>Broj narudžbe</p>
										{filterDirectionIcons('orderNumber')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders?sort=createdAt&direction=${
											direction == 'asc' ? 'desc' : 'asc'
										}`}
									>
										<div className="seperator"></div>
										<p>Datum</p>
										{filterDirectionIcons('createdAt')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders?sort=status&direction=${
											direction == 'asc' ? 'desc' : 'asc'
										}`}
									>
										<div className="seperator"></div>
										<p>Status</p>
										{filterDirectionIcons('status')}
									</a>
								</th>
								<th>
									<a
										href={`/user/orders?sort=amount&direction=${
											direction == 'asc' ? 'desc' : 'asc'
										}`}
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
				</div>
			</div>
		</div>
	);
}

export default UserOrders;
