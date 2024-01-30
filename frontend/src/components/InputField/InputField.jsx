import React from 'react';

// Styles
import './InputField.css';

import { Field } from 'formik';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function InputField({
	name,
	label,
	type,
	placeholder,
	value,
	width,
	passwordShow,
	togglePasswordShow,
}) {
	return (
		<div className="input-container">
			<Field
				type={type ? type : passwordShow ? 'text' : 'password'}
				id={name}
				name={name}
				autoCapitalize="off"
				className="input-field"
				style={{ width: width }}
				required
				placeholder={placeholder}
			/>
			<label htmlFor={name} className="input-label">
				{placeholder}
			</label>
			{passwordShow != null && (
				<button type="button" onClick={() => togglePasswordShow()}>
					{passwordShow ? <FaRegEyeSlash size={24} /> : <FaRegEye size={24} />}
				</button>
			)}
		</div>
	);
}

export default InputField;
