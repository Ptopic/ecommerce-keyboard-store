import React, { useEffect, useState } from 'react';
import './SearchModal.css';

// Icons
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';

import { Link } from 'react-router-dom';

import { request } from '../../api';

import { useNavigate } from 'react-router-dom';

function SearchModal({ toggleSearchOpen }) {
	const navigate = useNavigate();
	const [foundItems, setFoundItems] = useState(null);
	const [searchTermValue, setSearchTermValue] = useState('');
	function debounce(func, timeout = 300) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	const searchItems = debounce(async (e) => {
		const searchTerm = e.target.value;

		if (searchTerm == '') {
			setFoundItems(null);
			setSearchTermValue('');
		} else {
			// Get found items from database
			const res = await request.get(`/products/search?search=${searchTerm}`);
			const data = res.data.data;

			console.log(data);

			setSearchTermValue(searchTerm);

			// Set found items to items retrieved from database
			setFoundItems(data);
		}
	}, 600);

	const searchItemHandler = (item) => {
		toggleSearchOpen();
		navigate(`/product/${item._id}`);
	};

	return (
		<div className="search-modal-container">
			<div className="search-bar-container">
				<div className="input-group">
					<AiOutlineSearch size={26} />
					<input
						type="text"
						name="search"
						placeholder="Search"
						autoComplete="off"
						autoCapitalize="off"
						onInput={(e) => searchItems(e)}
					/>
				</div>

				<button onClick={() => toggleSearchOpen()}>
					<AiOutlineClose size={28} />
				</button>
			</div>
			{foundItems && (
				<div className="found-items">
					<div className="found-items-products-card">
						<h2>Products</h2>
						<Link to={'/products'}>View all products</Link>
					</div>

					{foundItems.length > 0 ? (
						<div className="found-items-container">
							{foundItems.map((item) => {
								return (
									<div
										className="found-items-item"
										onClick={() => searchItemHandler(item)}
									>
										<img src={item.image[0]} alt="" />

										<h2>{item.title}</h2>

										<p>€{item.price}</p>
									</div>
								);
							})}
						</div>
					) : (
						<div className="search-not-found">
							Sorry, nothing found for <strong>{searchTermValue}</strong>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default SearchModal;
