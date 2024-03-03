import React, { useState, useEffect } from 'react';
import './Categories.css';
import '../../styles/tables.css';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Components
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request, userRequest } from '../../api';

// Icons
import { FaPen, FaTrash } from 'react-icons/fa';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

function Categories() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
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

	const getCategoriesData = async () => {
		// Get params from url and sort data if needed or change page
		try {
			const res = await userRequest.get('/categories', {
				params: {
					sort: sort,
					direction: direction,
					page: page,
					pageSize: pageSize,
					search: searchTermValue,
				},
			});
			console.log(res.data.totalPages);
			setTotalPages(res.data.totalPages - 1);
			setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		// On page load set active screen to Users to display in side bar
		dispatch(setActiveScreen('Categories'));

		getCategoriesData();
	}, []);

	useEffect(() => {
		getCategoriesData();
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
		setCategoryIdToDelete(categoryId);
		setDeleteModal({ open: true, text: textValue });
	};

	const closeDeleteModal = () => {
		setCategoryIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
	};

	const handleCategoryDelete = async () => {
		await userRequest.delete(`/categories/${categoryIdToDelete}`);
		setCategoryIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
		// Reset all filters
		navigate(`/categories?page=${page}&pageSize=${pageSize}${
			sort != null ? '&sort=' + sort : ''
		}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}`);

		// Refresh page
		navigate(0);
	};

	return (
		<>
			<div className="categories-list">
				<InputField
					type={'text'}
					name={'search'}
					placeholder={'Search categories by name'}
					value={searchTermValue}
					onChange={(e) => setSearchTermValue(e.target.value)}
					width={'50%'}
					icon={
						<Link
							to={`/categories${
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
						to={`/categories/add?page=${page}&pageSize=${pageSize}${
							sort != null ? '&sort=' + sort : ''
						}${direction != null ? '&direction=' + direction : ''}
				${searchTermValue != null ? '&search=' + searchTermValue : ''}
`}
						className="add-btn"
					>
						Add new Category
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
									href={`/categories
										?sort=name
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}
										&direction=${direction == 'asc' ? 'desc' : 'asc'}`}
								>
									<div className="seperator"></div>
									<h1>Name</h1>
									{filterDirectionIcons('name')}
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
						{data.map((category) => {
							return (
								<tr className="table-content-row">
									<td>{category._id.toString().substring(0, 5) + '...'}</td>
									<td>{category.name}</td>
									<td className="actions-row">
										<Link
											to={`/categories/edit/${
												category._id
											}?page=${page}&pageSize=${pageSize}${
												sort != null ? '&sort=' + sort : ''
											}${direction != null ? '&direction=' + direction : ''}
													${searchTermValue != null ? '&search=' + searchTermValue : ''}
									`}
											className="action-btn"
											title="Edit Category"
										>
											<FaPen />
										</Link>
										<button
											type="button"
											className="delete-btn"
											title="Delete Category"
											onClick={() =>
												openDeleteModal(`${category.name}`, category._id)
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
							to={`/categories?page=${Number(page) - 1}&pageSize=${pageSize}${
								sort != null ? '&sort=' + sort : ''
							}${direction != null ? '&direction=' + direction : ''}
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
							to={`/categories?page=${Number(page) + 1}&pageSize=${pageSize}${
								sort != null ? '&sort=' + sort : ''
							}${direction != null ? '&direction=' + direction : ''}
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
					type={'Category'}
					handleDelete={handleCategoryDelete}
					closeDeleteModal={closeDeleteModal}
				/>
			)}
		</>
	);
}

export default Categories;
