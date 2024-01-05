import React, { useState, useEffect } from 'react';

import './widgetLg.css';

// Images
import defaultUserAvatar from '../../assets/images/user.jpg';

export default function WidgetLg({ data }) {
	let newDates = [];
	const Button = ({ type, text }) => {
		return (
			<button
				className={`widgetLgButton ${
					type != 'Declined' ? 'Approved' : 'Declined'
				}`}
			>
				{text ? text : type}
			</button>
		);
	};

	const formatDates = () => {
		for (let order of data) {
			let date = order.createdAt.split('T')[0];
			const dateSplited = date.split('-');

			const year = dateSplited[0];
			const month = dateSplited[1];
			const day = dateSplited[2];

			const newDateString = `${day}.${month}.${year}`;

			newDates.push(newDateString);
		}
	};

	formatDates();

	return (
		<div className="widgetLg">
			<h3 className="widgetLgTitle">Latest Orders</h3>
			<table className="widgetLgTable">
				<tr className="widgetLgTr">
					<th className="widgetLgTh">Customer</th>
					<th className="widgetLgTh">Date</th>
					<th className="widgetLgTh">Amount</th>
					<th className="widgetLgTh">Status</th>
				</tr>

				{data.map((order, index) => {
					return (
						<tr className="widgetLgTr" key={index}>
							<td className="widgetLgUser">
								<img
									src={
										data.user != (undefined || null) &&
										data.user.image != (undefined || null)
											? data.user.image
											: defaultUserAvatar
									}
									alt=""
									className="widgetLgImg"
								/>
								<span className="widgetLgName">{order.name}</span>
							</td>
							<td className="widgetLgDate">{newDates[index]}</td>
							<td className="widgetLgAmount">€{order.amount}</td>
							<td className="widgetLgStatus">
								{order.status != 'Declined' ? (
									<Button type="Approved" text={order.status} />
								) : (
									<Button type="Declined" />
								)}
							</td>
						</tr>
					);
				})}

				{/* <tr className="widgetLgTr">
					<td className="widgetLgUser">
						<img
							src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
							alt=""
							className="widgetLgImg"
						/>
						<span className="widgetLgName">Susan Carol</span>
					</td>
					<td className="widgetLgDate">2 Jun 2021</td>
					<td className="widgetLgAmount">$122.00</td>
					<td className="widgetLgStatus">
						<Button type="Declined" />
					</td>
				</tr>
				<tr className="widgetLgTr">
					<td className="widgetLgUser">
						<img
							src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
							alt=""
							className="widgetLgImg"
						/>
						<span className="widgetLgName">Susan Carol</span>
					</td>
					<td className="widgetLgDate">2 Jun 2021</td>
					<td className="widgetLgAmount">$122.00</td>
					<td className="widgetLgStatus">
						<Button type="Pending" />
					</td>
				</tr>
				<tr className="widgetLgTr">
					<td className="widgetLgUser">
						<img
							src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
							alt=""
							className="widgetLgImg"
						/>
						<span className="widgetLgName">Susan Carol</span>
					</td>
					<td className="widgetLgDate">2 Jun 2021</td>
					<td className="widgetLgAmount">$122.00</td>
					<td className="widgetLgStatus">
						<Button type="Approved" />
					</td>
				</tr> */}
			</table>
		</div>
	);
}
