import React from 'react';
import './Button.css';

function Button({
	width,
	text,
	icon,
	backgroundColor,
	textColor,
	isLoading,
	onClickFunction,
	...props
}) {
	return (
		<button
			type={props.type ? props.type : 'button'}
			className="btn"
			style={{
				width: width,
				backgroundColor: isLoading || props.disabled ? 'gray' : backgroundColor,
				color: textColor,
			}}
			disabled={isLoading || props.disabled}
			onClick={() => onClickFunction()}
		>
			{icon}
			{isLoading ? <div className="spinner"></div> : text}
		</button>
	);
}

export default Button;
