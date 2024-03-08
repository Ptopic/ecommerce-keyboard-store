import React, { useState, useEffect } from 'react';

// Styles
import './SelectOrderProductsModal.css';
import '../../styles/modals.css';

// Components
import CloseBtn from '../CloseBtn/CloseBtn';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Icons
import { AiOutlineSearch } from 'react-icons/ai';

// Utils
import { userRequest } from '../../api';

import { Link } from 'react-router-dom';
import OrderProductsTable from '../OrderProductsTable/OrderProductsTable';

const SelectOrderProductsModal = ({ toggleAddProductsModal }) => {
	const [products, setProducts] = useState(null);

	const [page, setPage] = useState(0);
	const pageDisplay = Number(page) + 1;
	const pageSize = 5;

	const [searchInputValue, setSearchInputValue] = useState('');
	const [search, setSearch] = useState('');

	const getProducts = async () => {
		const res = await userRequest.get('/products/admin', {
			params: {
				page: page ? page : 0,
				pageSize: pageSize ? pageSize : null,
				search: search ? search : null,
			},
		});

		let productsData = res.data.data;

		setProducts(productsData);
	};

	useEffect(() => {
		getProducts();
	}, []);

	useEffect(() => {
		if (search && search != '') {
			getProducts();
		}
	}, [search]);

	return (
		<div className="modal-overlay">
			<div className="modal select-products">
				<div className="select-order-products-modal-header">
					<h2>Select order products</h2>

					<InputField
						type={'text'}
						name={'search'}
						placeholder={'Search products by title or category'}
						value={searchInputValue}
						onChange={(e) => {
							setSearchInputValue(e.target.value);
						}}
						width={'50%'}
						icon={
							<button type="button" onClick={() => setSearch(searchInputValue)}>
								<AiOutlineSearch size={32} />
							</button>
						}
					/>

					<CloseBtn handleClose={toggleAddProductsModal} />
				</div>
				<div className="select-order-products-modal-content">
					<OrderProductsTable data={products} />
				</div>
			</div>
		</div>
	);
};

export default SelectOrderProductsModal;
