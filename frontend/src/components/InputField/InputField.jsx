import React from 'react';

// Styles
import './InputField.css';

import { Field } from 'formik';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function InputField({
	name,
	type,
	placeholder,
	value,
	onChange,
	required,
	width,
	fullWidth,
	passwordShow,
	togglePasswordShow,
	icon,
	errors,
	touched,
	disabled,
	validate,
}) {
	return (
		<>
			<div
				className={`input-container ${fullWidth ? 'full' : ''} ${
					disabled ? 'disabled' : ''
				}`}
				style={{ width: fullWidth ? '100%' : width }}
			>
				<input
					type={type ? type : passwordShow ? 'text' : 'password'}
					id={name}
					name={name}
					autoCapitalize="off"
					className="input-field"
					required={required == false ? false : true}
					placeholder={placeholder}
					value={value || ''}
					onChange={onChange}
					disabled={disabled}
					validate={validate}
				/>
				<label htmlFor={name} className="input-label">
					{placeholder}
				</label>
				{passwordShow != null && (
					<button type="button" onClick={() => togglePasswordShow()}>
						{passwordShow ? (
							<FaRegEyeSlash size={22} />
						) : (
							<FaRegEye size={22} />
						)}
					</button>
				)}
				{icon && icon}
			</div>
			{errors && touched ? <div className="error">{errors}</div> : null}
		</>
	);
}

export default InputField;
