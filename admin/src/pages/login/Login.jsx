import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCalls';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();

	const handleLogin = (e) => {
		e.preventDefault();
		login(dispatch, { username, password });
	};
	return (
		<div>
			<input
				type="text"
				placeholder="username"
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="password"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={(e) => handleLogin(e)}>Login</button>
		</div>
	);
}

export default Login;
