import React, { useState, useEffect } from 'react';
import Chart from '../../components/chart/Chart';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import './home.css';
import { userData } from '../../dummyData';
import WidgetSm from '../../components/widgetSm/WidgetSm';
import WidgetLg from '../../components/widgetLg/WidgetLg';

// Redux
import { useSelector } from 'react-redux';

// Api
import { admin_request } from '../../api';

export default function Home() {
	const user = useSelector((state) => state.user);
	const [sales, setSales] = useState([]);
	const [salesForChart, setSalesForChart] = useState([]);
	const [salesPercentage, setSalesPercentage] = useState(0);
	const [totalSales, setTotalSales] = useState(0);
	const [users, setUsers] = useState([]);
	const [usersCount, setUsersCount] = useState(0);
	const [usersPercentage, setUsersPercentage] = useState(0);
	const [orders, setOrders] = useState([]);
	const [ordersCount, setOrdersCount] = useState(0);
	const [ordersPercentage, setOrdersPercentage] = useState(0);
	const [latestOrders, setLatestOrders] = useState([]);

	let userToken = user.currentUser.token;

	const getSalesIncomeData = async () => {
		try {
			const res = await admin_request(userToken).get('/orders/income');
			setSales(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getUsersCount = async () => {
		try {
			const res = await admin_request(userToken).get('/user/count');
			setUsers(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getOrdersCount = async () => {
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

	const convertSalesForChart = () => {
		const convertedSales = [];

		// Sort users array by month and date

		for (let i = 0; i < sales.length; i++) {
			let date = sales[i]._id.month + '-' + sales[i]._id.year;
			let dateObj = { date: date, totalSales: sales[i].totalSales };
			convertedSales.push(dateObj);
		}

		// Sort values by date
		let sortedSales = convertedSales.sort((a, b) => (a.date > b.date ? -1 : 1));

		setSalesForChart(sortedSales);
	};

	// Get data on page load
	useEffect(() => {
		getSalesIncomeData();
		getUsersCount();
		getOrdersCount();
		getLatestOrders();
	}, []);

	// When sales changes accumulate totals of sales
	useEffect(() => {
		// Accumulate totals of sales
		let totalSalesValue = 0;
		for (let sale of sales) {
			totalSalesValue += sale.totalSales;
		}

		setTotalSales(totalSalesValue);

		if (sales.length > 1) {
			// Calculate sale percentage increase/decrease compared to previous month
			let curValue = sales[sales.length - 1].totalSales;
			let prevValue = sales[sales.length - 2].totalSales;

			let percentageChange = calculatePercentageChange(
				curValue,
				prevValue
			).toFixed(1);

			setSalesPercentage(percentageChange);
		} else {
			setSalesPercentage(Number(0).toFixed(1));
		}

		convertSalesForChart();
	}, [sales]);

	// When users changes accumulate total of users
	useEffect(() => {
		console.log(users);
		// Accumulate totals of sales
		let totalUsersValue = 0;
		for (let user of users) {
			totalUsersValue += user.usersCount;
		}

		setUsersCount(totalUsersValue);

		if (users.length > 1) {
			// Calculate users percentage increase/decrease compared to previous month
			let curValue = users[users.length - 1].usersCount;
			let prevValue = users[users.length - 2].usersCount;

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
		// Accumulate totals of sales
		let totalOrdersValue = 0;
		for (let order of orders) {
			totalOrdersValue += order.ordersCount;
		}

		setOrdersCount(totalOrdersValue);

		if (orders.length > 1) {
			// Calculate orders percentage increase/decrease compared to previous month
			let curValue = orders[orders.length - 1].ordersCount;
			let prevValue = orders[orders.length - 2].ordersCount;

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
				sales={totalSales}
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
				dataKey="totalSales"
			/>
			<div className="homeWidgets">
				<WidgetLg data={latestOrders} />
			</div>
		</div>
	);
}
