import React from 'react';
import './topbar.css';
import { NotificationsNone, Language, Settings } from '@material-ui/icons';

// Redux

import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userRedux';

// Images
import defaultUserAvatar from '../../assets/images/user.jpg';

// Redux
import { useSelector } from 'react-redux';

export default function Topbar() {
	const user = useSelector((state) => state.user);
	let currentUser = user.currentUser.data;
	console.log(currentUser);
	const dispatch = useDispatch();
	const handleLogOut = () => {
		dispatch(logout());
		window.location.reload();
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
							currentUser.picture != (undefined || null)
								? currentUser.picture
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
