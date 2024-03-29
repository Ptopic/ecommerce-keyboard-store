import { useState, useEffect } from 'react';
import './UserList.css';
import '../../styles/tables.css';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Components
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Redux
import { useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { userRequest } from '../../api';

// Icons
import { FaPen, FaTrash } from 'react-icons/fa';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useGetUsers } from '../../hooks/useGetUsers';

import Spinner from '../../components/Spinner/Spinner';

export default function UserList() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userIdToDelete, setUserIdToDelete] = useState(null);
	// const [data, setData] = useState([]);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		text: '',
	});

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

	const { isLoading, isFetching, data } = useGetUsers(
		sort,
		direction,
		page,
		pageSize,
		searchTermValue
	);

	const totalPages = data ? data?.totalPages - 1 : 0;

	useEffect(() => {
		// On page load set active screen to Users to display in side bar
		dispatch(setActiveScreen('Users'));
	}, []);

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
		await userRequest.delete(`/user/${userIdToDelete}`);
		setUserIdToDelete(null);
		setDeleteModal({ open: false, text: '' });

		// Reset all filters
		navigate(`/users?page=${page}&pageSize=${pageSize}${
			sort != null ? '&sort=' + sort : ''
		}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}`);

		// Refresh page
		navigate(0);
	};

	return (
		<>
			<div className="user-list">
				<h1 className="title">Users</h1>
				<InputField
					type={'text'}
					name={'search'}
					placeholder={'Search users by email'}
					value={searchTermValue}
					onChange={(e) => setSearchTermValue(e.target.value)}
					width={'50%'}
					icon={
						<Link
							to={`/users${
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
				<div className="add-new-container">
					<Link
						to={`/users/add?page=${page}&pageSize=${pageSize}${
							sort != null ? '&sort=' + sort : ''
						}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}`}
						className="add-btn"
					>
						Add new User
					</Link>
				</div>
				{isLoading || isFetching ? (
					<div className="loading-spinner-container">
						<Spinner />
					</div>
				) : (
					<>
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
											{filterDirectionIcons('isAdmin')}
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
								{data?.data?.map((user) => {
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
													className={
														user.isAdmin ? 'admin-user' : 'librarian-user'
													}
												>
													{user.isAdmin ? 'Admin' : 'User'}
												</span>
											</td>
											<td className="actions-row">
												<Link
													to={`/users/edit/${
														user._id
													}?page=${page}&pageSize=${pageSize}${
														sort != null ? '&sort=' + sort : ''
													}${direction != null ? '&direction=' + direction : ''}
														${searchTermValue != null ? '&search=' + searchTermValue : ''}`}
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
					</>
				)}
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
