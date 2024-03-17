import React, { useState, useRef, useEffect } from 'react';
import './Analytics.css';

// Components
import Chart from '../../components/chart/Chart';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request, userRequest } from '../../api';

const Analytics = () => {
	const dispatch = useDispatch();

	const [sales, setSales] = useState([]);
	const [salesChartData, setSalesChartData] = useState([]);
	const [salesMax, setSalesMax] = useState(0);
	const [users, setUsers] = useState([]);
	const [usersChartData, setUsersChartData] = useState([]);
	const [usersMax, setUsersMax] = useState(0);
	const [orders, setOrders] = useState([]);
	const [ordersChartData, setOrdersChartData] = useState([]);
	const [orderMax, setOrderMax] = useState(0);

	const getSalesData = async () => {
		try {
			const res = await userRequest.get('/orders/income');
			setSales(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getUsersData = async () => {
		try {
			const res = await userRequest.get('/user/count');
			setUsers(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getOrdersData = async () => {
		try {
			const res = await userRequest.get('/orders/count');
			setOrders(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const convertToObj = (arr, field) => {
		const converted = [];

		// Sort users array by month and date

		for (let i = 0; i < arr.length; i++) {
			let month = arr[i]._id.month;
			let year = arr[i]._id.year;
			let date = new Date(year, month - 1);
			let dateObj = {
				date: date,
				dateFormated: month + '-' + year,
				month: month,
				year: year,
				value: arr[i][field],
			};
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
			const salesValuesArray = sales.map((sale) => sale.totalSales);

			let curSalesValues = convertToObj(sales, 'totalSales');

			// Convert sales arr for chart usage
			// Sort values by date
			let sortedSales = curSalesValues.sort((a, b) => b.date - a.date);

			// Fix all sort values to 2 decimal
			for (let i = 0; i < sortedSales.length; i++) {
				sortedSales[i].value = sortedSales[i].value.toFixed(2);
			}

			const salesMaxValue = Math.max(...salesValuesArray);
			setSalesMax(salesMaxValue);

			setSalesChartData(sortedSales);
		}
	}, [sales]);

	// When usersData changes convert them to object and put it in state for chart usage
	useEffect(() => {
		if (users.length > 1) {
			const usersValuesArray = users.map((user) => user.usersCount);
			let curUsersValues = convertToObj(users, 'usersCount');

			// Convert users arr for chart usage
			// Sort values by date
			let sortedUsers = curUsersValues.sort((a, b) => b.date - a.date);

			const usersMaxValue = Math.max(...usersValuesArray);
			setUsersMax(usersMaxValue);

			setUsersChartData(sortedUsers);
		}
	}, [users]);

	// When ordersData changes convert them to object and put it in state for chart usage
	useEffect(() => {
		if (orders.length > 1) {
			const ordersValuesArray = orders.map((order) => order.ordersCount);
			let curOrdersValues = convertToObj(orders, 'ordersCount');

			// Convert orders arr for chart usage
			// Sort values by date
			let sortedOrders = curOrdersValues.sort((a, b) => b.date - a.date);

			const ordersMaxValue = Math.max(...ordersValuesArray);
			setOrderMax(ordersMaxValue);

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
				maxValue={salesMax}
			/>

			<Chart
				data={usersChartData}
				title="Users Analytics"
				grid
				dataKey="value"
				maxValue={usersMax}
			/>

			<Chart
				data={ordersChartData}
				title="Orders Analytics"
				grid
				dataKey="value"
				maxValue={orderMax}
			/>
		</div>
	);
};

export default Analytics;
