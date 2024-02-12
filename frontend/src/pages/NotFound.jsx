import React from 'react';

import './NotFound.css';

import { Link } from 'react-router-dom';

import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
	return (
		<div className="not-found">
			<h1>
				<FaExclamationTriangle /> 404
			</h1>
			<h4>Sorry, there is nothing here</h4>
			<Link to={'/'}>Go Back Home</Link>
		</div>
	);
};

export default NotFound;
