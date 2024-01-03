import React from 'react';
import './OrderStatus.css';

// Icons
import { IoCheckmarkOutline } from 'react-icons/io5';
import { BsTruck, BsBox2, BsHouse } from 'react-icons/bs';
function OrderStatus({ status }) {
	let step = 2;

	if (status == 'Delivering') {
		step = 3;
	} else if (status == 'Delivered') {
		step = 4;
	}
	return (
		<div className="order-status-container">
			<div className="order-status-container-top">
				<div style={{ backgroundColor: step <= 4 ? '#f6f6f6' : null }}>
					<IoCheckmarkOutline color={step <= 4 ? 'red' : null} />
					<p style={{ color: step <= 4 ? 'red' : null }}>Confirmed</p>
				</div>
				<div style={{ backgroundColor: step <= 4 ? '#f6f6f6' : null }}>
					<BsTruck color={step <= 4 ? 'red' : null} />
					<p style={{ color: step <= 4 ? 'red' : null }}>On its way</p>
				</div>
				<div
					style={{ backgroundColor: step == 3 || step == 4 ? '#f6f6f6' : null }}
				>
					<BsBox2 color={step == 3 || step == 4 ? 'red' : null} />
					<p style={{ color: step == 3 || step == 4 ? 'red' : null }}>
						Out for delivery
					</p>
				</div>
				<div style={{ backgroundColor: step == 4 ? '#f6f6f6' : null }}>
					<BsHouse color={step == 4 ? 'red' : null} />
					<p style={{ color: step == 4 ? 'red' : null }}>Delivered</p>
				</div>
			</div>

			<div className="order-status-container-bottom"></div>
		</div>
	);
}

export default OrderStatus;
