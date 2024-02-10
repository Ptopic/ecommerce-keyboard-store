import React, { useState, useEffect, useRef } from 'react';
import './UserList.css';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Components
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request } from '../../api';

// Icons
import { FaPen, FaTrash } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

export default function UserList() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [userIdToDelete, setUserIdToDelete] = useState(null);
	const [data, setData] = useState([]);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		text: '',
	});

	let userToken = user.currentUser.token;

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

	const getUsersData = async () => {
		// Get params from url and sort data if needed or change page
		try {
			const res = await admin_request(userToken).get('/user', {
				params: {
					sort: sort,
					direction: direction,
					page: page,
					pageSize: pageSize,
					search: searchTermValue,
				},
			});
			setTotalPages(res.data.totalPages - 1);
			setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		// On page load set active screen to Users to display in side bar
		dispatch(setActiveScreen('Users'));

		getUsersData();
	}, []);

	useEffect(() => {
		getUsersData();
	}, [page, pageSize, searchTermValue, sort, direction]);

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

	const openDeleteModal = (textValue, userId) => {
		setUserIdToDelete(userId);
		setDeleteModal({ open: true, text: textValue });
	};

	const closeDeleteModal = () => {
		setUserIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
	};

	const handleUserDelete = async () => {
		await admin_request(userToken).delete(`/user/${userIdToDelete}`);
		setUserIdToDelete(null);
		setDeleteModal({ open: false, text: '' });

		// Reset all filters
		navigate('/users');

		// Refresh page
		navigate(0);
	};

	return (
		<>
			<div className="user-list">
				<Formik enableReinitialize>
					{() => (
						<Form>
							<InputField
								type={'text'}
								name={'search'}
								placeholder={'Search users by email'}
								value={searchTermValue}
								onChange={(e) => setSearchTermValue(e.target.value)}
								width={'50%'}
								icon={
									<Link
										to={`/user
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
				<div className="add-new-container">
					<Link to={'/users/add'} className="add-btn">
						Add new User
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
									href={`/users
										?sort=firstName
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
								>
									<div className="seperator"></div>
									<h1>First Name</h1>
									{filterDirectionIcons('firstName')}
								</a>
							</th>
							<th>
								<a
									href={`/users
										?sort=lastName
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
								>
									<div className="seperator"></div>
									<h1>Last Name</h1>
									{filterDirectionIcons('lastName')}
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									Username
								</a>
							</th>
							<th>
								<a
									href={`/users
										?sort=email
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
								>
									<div className="seperator"></div>
									<h1>Email</h1>
									{filterDirectionIcons('email')}
								</a>
							</th>
							<th>
								<a
									href={`/users
										?sort=isAdmin
										&direction=${direction == 'asc' ? 'desc' : 'asc'}
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}`}
								>
									<div className="seperator"></div>
									<h1>Role</h1>
									{filterDirectionIcons('roles')}
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>Actions
								</a>
							</th>
						</tr>
					</thead>

					<tbody className="table-content">
						{data.map((user) => {
							return (
								<tr className="table-content-row">
									<td>{user._id.toString().substring(0, 5) + '...'}</td>
									<td>{user.firstName}</td>
									<td>{user.lastName}</td>
									<td>{user.username}</td>
									<td>
										<a href={`mailto:' + ${user.email}`}>{user.email}</a>
									</td>
									<td>
										<span
											className={user.isAdmin ? 'admin-user' : 'librarian-user'}
										>
											{user.isAdmin ? 'Admin' : 'User'}
										</span>
									</td>
									<td className="actions-row">
										{/* <Link
											to={`/users/${user._id}`}
											className="action-btn"
											role="button"
											title="User Details"
										>
											<BsFillPersonLinesFill />
										</Link> */}
										<Link
											to={`/users/edit/${user._id}`}
											className="action-btn"
											title="Edit User"
										>
											<FaPen />
										</Link>
										<button
											type="button"
											className="delete-btn"
											title="Delete User"
											onClick={() =>
												openDeleteModal(
													`${user.firstName} ${user.lastName}`,
													user._id
												)
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
				<div className="pagination-controls">
					{page != 0 && totalPages > 0 && (
						<Link
							className="prev-btn"
							to={`/users
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
							to={`/users
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
			{deleteModal.open && (
				<DeleteModal
					text={deleteModal.text}
					type={'User'}
					handleDelete={handleUserDelete}
					closeDeleteModal={closeDeleteModal}
				/>
			)}
		</>
	);
}
