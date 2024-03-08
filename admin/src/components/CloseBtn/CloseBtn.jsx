import React from 'react';
import './CloseBtn.css';

// Icons
import { IoClose } from 'react-icons/io5';

const CloseBtn = ({ handleClose }) => {
	return (
		<button
			type="button"
			className="close-btn-component"
			onClick={() => handleClose()}
		>
			<IoClose />
		</button>
	);
};

export default CloseBtn;
