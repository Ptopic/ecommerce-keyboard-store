import React from 'react';
import './Checkbox.css';

import { IoMdCheckmark } from 'react-icons/io';

const Checkbox = ({ state, setState, checkedValue, unCheckedValue, text }) => {
	return (
		<div className="checkout-checkbox">
			<button
				type="button"
				style={{
					background: state ? '#E81123' : '#fff',
					border: state ? 'none' : '1px solid black',
				}}
				onClick={() =>
					state ? setState(unCheckedValue) : setState(checkedValue)
				}
			>
				{state ? <IoMdCheckmark color={'white'} size={24} /> : null}
			</button>
			<p>{text}</p>
		</div>
	);
};

export default Checkbox;
