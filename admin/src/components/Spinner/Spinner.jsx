import React from 'react';
import './Spinner.css';
function Spinner({ height, width, color, borderWidth }) {
	return (
		<>
			<span
				class="loader"
				style={{
					height: height ? height + 'px' : '48px',
					width: width ? width + 'px' : '48px',
					borderColor: color ? color : '#E81123',
					borderBottomColor: 'transparent',
					borderWidth: borderWidth ? borderWidth + 'px' : '5px',
				}}
			></span>
		</>
	);
}

export default Spinner;
