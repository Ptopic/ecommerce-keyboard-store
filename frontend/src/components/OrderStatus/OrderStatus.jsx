import React from 'react';
import './OrderStatus.css';

// Icons
import { IoCheckmarkOutline } from 'react-icons/io5';
import { BsTruck, BsBox2, BsHouse } from 'react-icons/bs';
function OrderStatus({ status }) {
	console.log(status);
	let step;
	if (status == 'Paid') {
		step = 1;
	} else if (status == 'Packing') {
		step = 2;
	} else if (status == 'Delivering') {
		step = 3;
	} else if (status == 'Delivered') {
		step = 4;
	}
	return (
		<div className="order-status-container">
			<div className="order-status-container-top">
				<div
					style={{ backgroundColor: step == 1 || step > 1 ? '#f6f6f6' : null }}
				>
					<IoCheckmarkOutline color={step == 1 || step > 1 ? 'red' : null} />
					<p style={{ color: step == 1 || step > 1 ? 'red' : null }}>
						Confirmed
					</p>
				</div>
				<div
					style={{ backgroundColor: step > 1 || step > 2 ? '#f6f6f6' : null }}
				>
					<BsTruck color={step > 1 || step > 2 ? 'red' : null} />
					<p style={{ color: step > 1 || step > 2 ? 'red' : null }}>
						On its way
					</p>
				</div>
				<div
					style={{ backgroundColor: step > 2 || step > 3 ? '#f6f6f6' : null }}
				>
					<BsBox2 color={step > 2 || step > 3 ? 'red' : null} />
					<p style={{ color: step > 2 || step > 3 ? 'red' : null }}>
						Out for delivery
					</p>
				</div>
				<div style={{ backgroundColor: step > 3 ? '#f6f6f6' : null }}>
					<BsHouse color={step > 3 ? 'red' : null} />
					<p style={{ color: step > 3 ? 'red' : null }}>Delivered</p>
				</div>
			</div>

			<div className="order-status-container-bottom"></div>
		</div>
	);
}

export default OrderStatus;
