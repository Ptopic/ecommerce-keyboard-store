import React, { useEffect, useState } from 'react';
import Chart from '../../components/chart/Chart';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import './Home.css';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setActiveScreen } from '../../redux/userRedux';

// Api
import { useGetLatestOrders } from '../../hooks/useGetLatestOrders';
import { useGetOrdersStats } from '../../hooks/useGetOrdersStats';
import { useGetSales } from '../../hooks/useGetSales';
import { useGetUsersStats } from '../../hooks/useGetUsersStats';

import WidgetLg from '../../components/widgetLg/WidgetLg';

export default function Home() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [salesMax, setSalesMax] = useState(0);
	const [salesForChart, setSalesForChart] = useState([]);
	const [salesPercentage, setSalesPercentage] = useState(0);
	const [curSales, setCurSales] = useState(0);
	const [usersCount, setUsersCount] = useState(0);
	const [usersPercentage, setUsersPercentage] = useState(0);
	const [ordersCount, setOrdersCount] = useState(0);
	const [ordersPercentage, setOrdersPercentage] = useState(0);

	const { data: sales } = useGetSales();

	const { data: users } = useGetUsersStats();

	const { data: orders } = useGetOrdersStats();

	const { data: latestOrders } = useGetLatestOrders();

	const calculatePercentageChange = (cur, prev) => {
		let value = ((cur - prev) / prev) * 100;

		return value;
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

	// Get data on page load
	useEffect(() => {
		// On page load set active screen to Home to display in side bar
		dispatch(setActiveScreen('Home'));
	}, []);

	// When sales changes accumulate totals of sales
	useEffect(() => {
		if (sales?.length > 1) {
			const salesValuesArray = sales.map((sale) => sale.totalSales);

			// Set curSales to latest sale
			let curSalesValues = convertToObj(sales, 'totalSales');

			let latestSaleValue = curSalesValues.sort((a, b) => b.date - a.date);
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
			let sortedSales = curSalesValues.sort((a, b) => b.date - a.date);

			// Fix all sort values to 2 decimal
			for (let i = 0; i < sortedSales.length; i++) {
				sortedSales[i].value = sortedSales[i].value.toFixed(2);
			}

			setSalesForChart(sortedSales);

			const salesMaxValue = Math.max(...salesValuesArray);
			setSalesMax(salesMaxValue);
		} else {
			setCurSales(sales?.length > 0 ? sales[0]?.totalSales : 0);
			setSalesPercentage(Number(0).toFixed(1));
		}
	}, [sales]);

	// When users changes accumulate total of users
	useEffect(() => {
		if (users?.length > 1) {
			// Get latest users count
			// Set curUsers to latest users
			let curUsersValues = convertToObj(users, 'usersCount');
			let latestUsersValue = curUsersValues.sort((a, b) => b.date - a.date);

			setUsersCount(latestUsersValue[0].value);

			// Calculate users percentage increase/decrease compared to previous month
			let curValue = latestUsersValue[0].value;
			let prevValue = latestUsersValue[1].value;

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
		if (orders?.length > 1) {
			// Get latest orders count
			// Set curOrders to latest sale
			let curOrdersValues = convertToObj(orders, 'ordersCount');
			let latestOrderValues = curOrdersValues.sort((a, b) => b.date - a.date);

			setOrdersCount(latestOrderValues[0].value);

			// Calculate orders percentage increase/decrease compared to previous month
			let curValue = latestOrderValues[0].value;
			let prevValue = latestOrderValues[1].value;

			let percentageChange = calculatePercentageChange(
				curValue,
				prevValue
			).toFixed(1);

			setOrdersPercentage(percentageChange);
		} else {
			setOrdersCount(orders?.length > 0 ? orders[0]?.ordersCount : 0);
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
				maxValue={salesMax}
			/>
			<div className="homeWidgets">
				{latestOrders && <WidgetLg data={latestOrders} />}
			</div>
		</div>
	);
}
