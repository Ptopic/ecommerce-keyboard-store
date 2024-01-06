import React, { useState, useRef, useEffect } from 'react';
import './Analytics.css';

// Components
import Chart from '../../components/chart/Chart';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request } from '../../api';

const Analytics = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const [sales, setSales] = useState([]);
	const [salesChartData, setSalesChartData] = useState([]);
	const [users, setUsers] = useState([]);
	const [usersChartData, setUsersChartData] = useState([]);
	const [orders, setOrders] = useState([]);
	const [ordersChartData, setOrdersChartData] = useState([]);

	let userToken = user.currentUser.token;

	const getSalesData = async () => {
		try {
			const res = await admin_request(userToken).get('/orders/income');
			setSales(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getUsersData = async () => {
		try {
			const res = await admin_request(userToken).get('/user/count');
			setUsers(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getOrdersData = async () => {
		try {
			const res = await admin_request(userToken).get('/orders/count');
			setOrders(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const convertToObj = (arr, field) => {
		const converted = [];

		// Sort users array by month and date

		for (let i = 0; i < arr.length; i++) {
			let date = arr[i]._id.month + '-' + arr[i]._id.year;
			let dateObj = { date: date, value: arr[i][field] };
			converted.push(dateObj);
		}

		return converted;
	};

	useEffect(() => {
		// On page load set active screen to Home to display in side bar
		dispatch(setActiveScreen('Analytics'));

		// Load data
		getSalesData();
		getUsersData();
		getOrdersData();
	}, []);

	// When salesData changes convert them to object and put it in state for chart usage
	useEffect(() => {
		if (sales.length > 1) {
			let curSalesValues = convertToObj(sales, 'totalSales');

			// Convert sales arr for chart usage
			// Sort values by date
			let sortedSales = curSalesValues.sort((a, b) =>
				a.date > b.date ? -1 : 1
			);

			setSalesChartData(sortedSales);
		}
	}, [sales]);

	// When usersData changes convert them to object and put it in state for chart usage
	useEffect(() => {
		if (users.length > 1) {
			let curUsersValues = convertToObj(users, 'usersCount');

			// Convert users arr for chart usage
			// Sort values by date
			let sortedUsers = curUsersValues.sort((a, b) =>
				a.date > b.date ? -1 : 1
			);

			setUsersChartData(sortedUsers);
		}
	}, [users]);

	// When ordersData changes convert them to object and put it in state for chart usage
	useEffect(() => {
		if (orders.length > 1) {
			let curOrdersValues = convertToObj(orders, 'ordersCount');

			// Convert orders arr for chart usage
			// Sort values by date
			let sortedOrders = curOrdersValues.sort((a, b) =>
				a.date > b.date ? -1 : 1
			);

			setOrdersChartData(sortedOrders);
		}
	}, [orders]);
	return (
		<div className="analytics">
			<h1 className="analytics-title">Analytics</h1>
			<Chart
				data={salesChartData}
				title="Sales Analytics"
				grid
				dataKey="value"
			/>

			<Chart
				data={usersChartData}
				title="Users Analytics"
				grid
				dataKey="value"
			/>

			<Chart
				data={ordersChartData}
				title="Orders Analytics"
				grid
				dataKey="value"
			/>
		</div>
	);
};

export default Analytics;
