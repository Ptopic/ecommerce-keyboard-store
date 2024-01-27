import React, { useState, useEffect, useRef } from 'react';
import './userList.css';
import { Link } from 'react-router-dom';

// Components
import DeleteModal from '../../components/DeleteModal/DeleteModal';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request } from '../../api';

// Icons
import { FaPen, FaTrash } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';

export default function UserList() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [data, setData] = useState([]);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		text: '',
	});

	let userToken = user.currentUser.token;

	const getUsersData = async () => {
		// Get params from url and sort data if needed or change page
		try {
			const res = await admin_request(userToken).get('/user/');
			setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUsersData();
	}, []);

	const openDeleteModal = (textValue) => {
		setDeleteModal({ open: true, text: textValue });
	};

	const closeDeleteModal = () => {
		setDeleteModal({ open: false, text: '' });
	};

	return (
		<>
			<div className="user-list">
				<table className="table">
					<thead className="table-head">
						<tr>
							<th>
								<a href="">ID</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									First Name
									<i className="bi bi-sort-up"></i>
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									Last Name
									<i className="bi bi-sort-up"></i>
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									Username
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									E-Mail
									<i className="bi bi-sort-up"></i>
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>Role
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
												openDeleteModal(`${user.firstName} ${user.lastName}`)
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
			</div>
			{deleteModal.open && (
				<DeleteModal
					text={deleteModal.text}
					type={'User'}
					closeDeleteModal={closeDeleteModal}
				/>
			)}
		</>
	);
}
