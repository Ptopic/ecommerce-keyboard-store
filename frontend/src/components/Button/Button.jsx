import React from 'react';
import './Button.css';

function Button({
	width,
	text,
	icon,
	backgroundColor,
	borderColor,
	textColor,
	onClickFunction,
	isLoading,
	...props
}) {
	return (
		<button
			type={props.type ? props.type : 'button'}
			className="btn"
			style={{
				width: width,
				border: borderColor ? `2px solid ${borderColor}` : 'none',
				backgroundColor: isLoading || props.disabled ? 'gray' : backgroundColor,
				color: textColor,
			}}
			disabled={isLoading || props.disabled}
			onClick={() => (onClickFunction ? onClickFunction() : null)}
		>
			{icon}
			{isLoading ? <div className="spinner"></div> : text}
		</button>
	);
}

export default Button;
