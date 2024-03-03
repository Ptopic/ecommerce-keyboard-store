import React from 'react';
import './topbar.css';
import { NotificationsNone, Language, Settings } from '@mui/icons-material';

// Redux

import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userRedux';

// Images
import defaultUserAvatar from '../../assets/images/user.jpg';

// Redux
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

export default function Topbar() {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	let currentUser = user.currentUser.data;
	const dispatch = useDispatch();
	const handleLogOut = () => {
		dispatch(logout());
		// Navigate back to home page
		navigate('/');
	};

	return (
		<div className="topbar">
			<div className="topbarWrapper">
				<div className="topLeft">
					<span className="logo">Store Admin Panel</span>
				</div>
				<div className="topRight">
					{/* <div className="topbarIconContainer">
						<NotificationsNone />
						<span className="topIconBadge">2</span>
					</div>
					<div className="topbarIconContainer">
						<Settings />
					</div> */}
					<img
						src={
							currentUser?.picture != (undefined || null)
								? currentUser?.picture
								: defaultUserAvatar
						}
						alt=""
						className="topAvatar"
					/>
					<button onClick={() => handleLogOut()}>Logout</button>
				</div>
			</div>
		</div>
	);
}
