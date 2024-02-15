import React, { useState, useEffect } from 'react';
import './Products.css';
import '../../styles/tables.css';

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
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

// Formik
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';

const Products = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [productIdToDelete, setProductIdToDelete] = useState(null);
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

	const getProductsData = async () => {
		// Get params from url and sort data if needed or change page
		try {
			const res = await admin_request(userToken).get('/products', {
				params: {
					sort: sort,
					direction: direction,
					page: page,
					pageSize: pageSize,
					search: searchTermValue,
				},
			});
			console.log(res.data.data);
			setTotalPages(res.data.totalPages - 1);
			setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		// On page load set active screen to Users to display in side bar
		dispatch(setActiveScreen('Products'));

		getProductsData();
	}, []);

	useEffect(() => {
		getProductsData();
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

	const openDeleteModal = (textValue, categoryId) => {
		setProductIdToDelete(categoryId);
		setDeleteModal({ open: true, text: textValue });
	};

	const closeDeleteModal = () => {
		setProductIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
	};

	const handleProductDelete = async () => {
		const res = await admin_request(userToken).delete(
			`/products/${productIdToDelete}`
		);
		console.log(res);
		setProductIdToDelete(null);
		setDeleteModal({ open: false, text: '' });
		// Reset all filters
		navigate('/products');

		// Refresh page
		navigate(0);
	};

	return (
		<>
			<div className="products-list">
				<Formik enableReinitialize>
					{() => (
						<Form>
							<InputField
								type={'text'}
								name={'search'}
								placeholder={'Search products by title'}
								value={searchTermValue}
								onChange={(e) => setSearchTermValue(e.target.value)}
								width={'50%'}
								icon={
									<Link
										to={`/products
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
					<Link to={'/products/add'} className="add-btn">
						Add new Product
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
									href={`/products
										?sort=title
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}
										&direction=${direction == 'asc' ? 'desc' : 'asc'}`}
								>
									<div className="seperator"></div>
									<h1>Title</h1>
									{filterDirectionIcons('title')}
								</a>
							</th>
							<th>
								<a href="">
									<div className="seperator"></div>
									<h1>Variants</h1>
								</a>
							</th>
							<th>
								<a
									href={`/products
										?sort=category
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}
										&direction=${direction == 'asc' ? 'desc' : 'asc'}`}
								>
									<div className="seperator"></div>
									<h1>Category</h1>
									{filterDirectionIcons('category')}
								</a>
							</th>
							<th>
								<a
									href={`/products
										?sort=price
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}
										&direction=${direction == 'asc' ? 'desc' : 'asc'}`}
								>
									<div className="seperator"></div>
									<h1>Price</h1>
									{filterDirectionIcons('price')}
								</a>
							</th>
							<th>
								<a
									href={`/products
										?sort=stock
										&page=${page}
										&pageSize=${pageSize}
										&search=${searchTermValue}
										&direction=${direction == 'asc' ? 'desc' : 'asc'}`}
								>
									<div className="seperator"></div>
									<h1>Stock</h1>
									{filterDirectionIcons('stock')}
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
						{data.map((product) => {
							return (
								<tr className="table-content-row">
									<td>{product._id.toString().substring(0, 5) + '...'}</td>
									<td style={{ width: '600px' }}>
										<div className="product-title-and-image">
											{product.images.length > 0 && (
												<img
													src={product.images[0].url}
													alt="product image"
													className="product-image"
													loading="lazy"
												/>
											)}
											<div className="title-and-variants">{product.title}</div>
										</div>
									</td>
									<td className="variants-container">
										<div className="variants">
											<Link
												to={`/products/${product._id}/variants`}
												className="variants-btn"
											>
												Variants
											</Link>
										</div>
									</td>
									<td>{product.category}</td>
									<td>{product.price}</td>
									<td>{product.stock}</td>
									<td className="actions-row products">
										<Link
											to={`/products/edit/${product._id}`}
											className="action-btn"
											title="Edit Product"
										>
											<FaPen />
										</Link>
										<button
											type="button"
											className="delete-btn"
											title="Delete Product"
											onClick={() =>
												openDeleteModal(`${product.title}`, product._id)
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
							to={`/products?page=${Number(page) - 1}&pageSize=${pageSize}${
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
							to={`/products?page=${Number(page) + 1}&pageSize=${pageSize}${
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
					type={'Product'}
					handleDelete={handleProductDelete}
					closeDeleteModal={closeDeleteModal}
				/>
			)}
		</>
	);
};

export default Products;
