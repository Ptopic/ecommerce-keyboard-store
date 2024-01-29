import React, { useState, useEffect } from 'react';
import Chart from '../../components/chart/Chart';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import './home.css';
import WidgetLg from '../../components/widgetLg/WidgetLg';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { admin_request } from '../../api';

export default function Home() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [sales, setSales] = useState([]);
	const [salesForChart, setSalesForChart] = useState([]);
	const [salesPercentage, setSalesPercentage] = useState(0);
	const [curSales, setCurSales] = useState(0);
	const [users, setUsers] = useState([]);
	const [usersCount, setUsersCount] = useState(0);
	const [usersPercentage, setUsersPercentage] = useState(0);
	const [orders, setOrders] = useState([]);
	const [ordersCount, setOrdersCount] = useState(0);
	const [ordersPercentage, setOrdersPercentage] = useState(0);
	const [latestOrders, setLatestOrders] = useState([]);

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

	const getLatestOrders = async () => {
		try {
			const res = await admin_request(userToken).get(
				'/orders/?pageSize=4&page=0'
			);
			setLatestOrders(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const calculatePercentageChange = (cur, prev) => {
		let value = ((cur - prev) / prev) * 100;

		return value;
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

	// Get data on page load
	useEffect(() => {
		// On page load set active screen to Home to display in side bar
		dispatch(setActiveScreen('Home'));
		getSalesData();
		getUsersData();
		getOrdersData();
		getLatestOrders();
	}, []);

	// When sales changes accumulate totals of sales
	useEffect(() => {
		if (sales.length > 1) {
			// Set curSales to latest sale
			let curSalesValues = convertToObj(sales, 'totalSales');
			let latestSaleValue = curSalesValues.sort((a, b) =>
				a.date < b.date ? -1 : 1
			);
			console.log(latestSaleValue);
			// Set first latest sale value to display for analitics
			setCurSales(latestSaleValue[0].value.toFixed(2));
			// Calculate sale percentage increase/decrease compared to previous month
			let curValue = latestSaleValue[0].value;
			let prevValue = latestSaleValue[1].value;

			let percentageChange = calculatePercentageChange(
				curValue,
				prevValue
			).toFixed(1);

			setSalesPercentage(percentageChange);

			// Convert sales arr for chart usage - Order is different from other sales used for displaying percentages
			// Sort values by date
			let sortedSales = curSalesValues.sort((a, b) =>
				a.date > b.date ? -1 : 1
			);

			// Fix all sort values to 2 decimal
			for (let i = 0; i < sortedSales.length; i++) {
				sortedSales[i].value = sortedSales[i].value.toFixed(2);
			}

			setSalesForChart(sortedSales);
		} else {
			setSalesPercentage(Number(0).toFixed(1));
		}
	}, [sales]);

	// When users changes accumulate total of users
	useEffect(() => {
		if (users.length > 1) {
			// Get latest users count
			// Set curUsers to latest users
			let curUsersValues = convertToObj(users, 'usersCount');
			let latesUserValues = curUsersValues.sort((a, b) =>
				a.date < b.date ? -1 : 1
			);

			setUsersCount(latesUserValues[0].value);

			// Calculate users percentage increase/decrease compared to previous month
			let curValue = latesUserValues[0].value;
			let prevValue = latesUserValues[1].value;

			let percentageChange = calculatePercentageChange(
				curValue,
				prevValue
			).toFixed(1);

			setUsersPercentage(percentageChange);
		} else {
			setUsersPercentage(Number(0).toFixed(1));
		}
	}, [users]);

	// When orders changes accumulate total of orders
	useEffect(() => {
		if (orders.length > 1) {
			// Get latest orders count

			// Set curOrders to latest sale
			let curOrdersValues = convertToObj(orders, 'ordersCount');
			let latesOrdersValues = curOrdersValues.sort((a, b) =>
				a.date < b.date ? -1 : 1
			);

			setOrdersCount(latesOrdersValues[0].value);

			// Calculate orders percentage increase/decrease compared to previous month
			let curValue = latesOrdersValues[0].value;
			let prevValue = latesOrdersValues[1].value;

			let percentageChange = calculatePercentageChange(
				curValue,
				prevValue
			).toFixed(1);

			setOrdersPercentage(percentageChange);
		} else {
			setOrdersPercentage(Number(0).toFixed(1));
		}
	}, [orders]);
	return (
		<div className="home">
			<FeaturedInfo
				sales={curSales}
				salesPercentage={salesPercentage}
				usersCount={usersCount}
				usersPercentage={usersPercentage}
				ordersCount={ordersCount}
				ordersPercentage={ordersPercentage}
			/>
			<Chart
				data={salesForChart}
				title="Sales Analytics"
				grid
				dataKey="value"
			/>
			<div className="homeWidgets">
				<WidgetLg data={latestOrders} />
			</div>
		</div>
	);
}
