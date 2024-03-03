import React from 'react';

// Styles
import './InputField.css';

// Icons
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

function InputField({
	name,
	type,
	placeholder,
	value,
	onChange,
	onBlur,
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
	refValue,
}) {
	const renderPasswordVisibility = () => {
		if (passwordShow) {
			return <FaRegEyeSlash size={22} />;
		} else {
			return <FaRegEye size={22} />;
		}
	};
	return (
		<>
			<div
				className={`input-container ${fullWidth ? 'full' : ''} ${
					disabled ? 'disabled' : ''
				} ${errors && touched ? 'error' : ''}`}
				style={{ width: fullWidth ? '100%' : width }}
			>
				<input
					type={type ? type : passwordShow ? 'text' : 'password'}
					id={name}
					name={name}
					autoCapitalize="off"
					className={errors && touched ? 'input-field error' : 'input-field'}
					required={required == false ? false : true}
					placeholder={placeholder}
					value={value || ''}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					validate={validate}
					ref={refValue}
				/>
				<label
					htmlFor={name}
					className={errors && touched ? 'input-label error' : 'input-label'}
				>
					{placeholder}
				</label>
				{passwordShow != null && (
					<button type="button" onClick={() => togglePasswordShow()}>
						{renderPasswordVisibility()}
					</button>
				)}
				{errors && touched ? <MdError color={'#ff3333'} /> : icon ? icon : null}
				{errors && touched ? <p className="error-msg">{errors}</p> : null}
			</div>
		</>
	);
}

export default InputField;
