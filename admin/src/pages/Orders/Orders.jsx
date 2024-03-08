import React, { useState, useEffect } from 'react';
import './Orders.css';

// Components
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { userRequest } from '../../api';

// Icons
import { FaPen, FaTrash } from 'react-icons/fa';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

// Utils
import { formatPriceDisplay } from '../../../../frontend/src/utils/formatting';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PaginationControls from '../../components/PaginationControls/PaginationControls';

const Orders = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [orderIdToDelete, setOrderIdToDelete] = useState(null);
	const [data, setData] = useState([]);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		text: '',
	});

	const [searchParams, setSearchParams] = useSearchParams();
	const [totalPages, setTotalPages] = useState(0);

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

	const getOrdersData = async () => {
		try {
			const res = await userRequest.get('/orders', {
				params: {
					sort: sort,
					direction: direction,
					page: page,
					pageSize: pageSize,
					search: searchTermValue,
				},
			});
			// Format order dates
			for (let order of res.data.data) {
				let orderDate = order.createdAt.split('T')[0];
				let splittedDate = orderDate.split('-');
				let year;
				let month;
				let day;
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

			setTotalPages(res.data.totalPages - 1);
			setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		// On page load set active screen to Users to display in side bar
		dispatch(setActiveScreen('Orders'));

		getOrdersData();
	}, []);

	useEffect(() => {
		getOrdersData();
	}, [page, pageSize, sort, direction]);

	const filterDirectionIcons = (fieldName) => {
		if (sort == fieldName) {
			if (direction == 'asc') {
				return <FaSortAlphaDown color="black" size={20} />;
			} else {
				return <FaSortAlphaDownAlt color="black" size={20} />;
			}
		} else {
			return <FaSortAlphaDown color="black" size={20} />;
		}
	};

	const openDeleteModal = (textValue, categoryId) => {
		setOrderIdToDelete(categoryId);
		setDeleteModal({ open: true, text: textValue });
	};

	const closeDeleteModal = () => {
		setOrderIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
	};

	const handleOrderDelete = async () => {
		await userRequest.delete(`/orders/${orderIdToDelete}`);
		setOrderIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
		// Reset all filters
		navigate(`/orders?page=${page}&pageSize=${pageSize}${
			sort != null ? '&sort=' + sort : ''
		}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}`);

		// Refresh page
		navigate(0);
	};

	return (
		<>
			<div className="orders-container">
				<h1 className="title">Orders</h1>
				<InputField
					type={'text'}
					name={'search'}
					placeholder={'Search orders by order number or date'}
					value={searchTermValue}
					onChange={(e) => setSearchTermValue(e.target.value)}
					width={'50%'}
					icon={
						<Link
							to={`/orders${
								searchTermValue
									? `?direction=${direction}&page=${0}&pageSize=${pageSize}&search=${searchTermValue}`
									: ''
							}`}
						>
							<AiOutlineSearch size={32} />
						</Link>
					}
				/>

				<div className="add-new-container">
					<Link to={`/orders/add`} className="add-btn">
						Add new Order
					</Link>
				</div>

				<table className="table">
					<thead className="table-head">
						<tr>
							<th>
								<a href="">ID</a>
							</th>
							<th>
								<a
									href={`/orders?sort=name&page=${page}&pageSize=${pageSize}&search=${searchTermValue}&direction=${
										direction == 'asc' ? 'desc' : 'asc'
									}`}
								>
									<div className="seperator"></div>
									<h1>Ime</h1>
									{filterDirectionIcons('name')}
								</a>
							</th>
							<th>
								<a
									href={`/orders?sort=orderNumber&page=${page}&pageSize=${pageSize}&search=${searchTermValue}&direction=${
										direction == 'asc' ? 'desc' : 'asc'
									}`}
								>
									<div className="seperator"></div>
									<h1>Broj narudžbe</h1>
									{filterDirectionIcons('orderNumber')}
								</a>
							</th>
							<th>
								<a
									href={`/orders?sort=createdAt&page=${page}&pageSize=${pageSize}&search=${searchTermValue}&direction=${
										direction == 'asc' ? 'desc' : 'asc'
									}`}
								>
									<div className="seperator"></div>
									<h1>Datum</h1>
									{filterDirectionIcons('createdAt')}
								</a>
							</th>
							<th>
								<a
									href={`/orders?sort=status&page=${page}&pageSize=${pageSize}&search=${searchTermValue}&direction=${
										direction == 'asc' ? 'desc' : 'asc'
									}`}
								>
									<div className="seperator"></div>
									<h1>Status</h1>
									{filterDirectionIcons('status')}
								</a>
							</th>
							<th>
								<a
									href={`/orders?sort=amount&page=${page}&pageSize=${pageSize}&search=${searchTermValue}&direction=${
										direction == 'asc' ? 'desc' : 'asc'
									}`}
								>
									<div className="seperator"></div>
									<h1>Ukupno</h1>
									{filterDirectionIcons('amount')}
								</a>
							</th>
							<th>
								<a>
									<div className="seperator"></div>Actions
								</a>
							</th>
						</tr>
					</thead>

					<tbody className="table-content">
						{data.map((order) => {
							return (
								<tr className="table-content-row">
									<td>{order._id.toString().substring(0, 5) + '...'}</td>
									<td>{order.name}</td>
									<td>{order.orderNumber}</td>
									<td>{order.orderDate}</td>
									<td>{order.status}</td>
									<td>€{formatPriceDisplay(order.amount)}</td>
									<td className="actions-row">
										<Link
											to={`/orders/edit/${
												order._id
											}?page=${page}&pageSize=${pageSize}${
												sort != null ? '&sort=' + sort : ''
											}${direction != null ? '&direction=' + direction : ''}
                                    ${
																			searchTermValue != null
																				? '&search=' + searchTermValue
																				: ''
																		}
                        `}
											className="action-btn"
											title="Edit Order"
										>
											<FaPen />
										</Link>
										<button
											type="button"
											className="delete-btn"
											title="Delete Order"
											onClick={() =>
												openDeleteModal(`${order.name}`, order._id)
											}
										>
											<FaTrash />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<PaginationControls
					state={false}
					categoryName={'orders'}
					page={page}
					totalPages={totalPages}
					pageSize={pageSize}
					sort={sort}
					direction={direction}
					searchTermValue={searchTermValue}
				/>
			</div>
			{deleteModal.open && (
				<DeleteModal
					text={deleteModal.text}
					type={'Order'}
					handleDelete={handleOrderDelete}
					closeDeleteModal={closeDeleteModal}
				/>
			)}
		</>
	);
};

export default Orders;
