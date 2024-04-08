import './sidebar.css';
import {
	LineStyle,
	Timeline,
	TrendingUp,
	PermIdentity,
	Storefront,
	AttachMoney,
	BarChart,
	MailOutline,
	DynamicFeed,
	ChatBubbleOutline,
	WorkOutline,
	Report,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';

export default function Sidebar() {
	const user = useSelector((state) => state.user);
	const active = user.activeScreen;

	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Dashboard</h3>
					<ul className="sidebarList">
						<Link to="/" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Home' ? 'active' : ''
								}`}
							>
								<LineStyle className="sidebarIcon" />
								Home
							</li>
						</Link>
						<Link to="/analytics" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Analytics' ? 'active' : ''
								}`}
							>
								<Timeline className="sidebarIcon" />
								Analytics
							</li>
						</Link>
					</ul>
				</div>
				<div className="sidebarMenu">
					<h3 className="sidebarTitle">Quick Menu</h3>
					<ul className="sidebarList">
						<Link to="/users" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Users' ? 'active' : ''
								}`}
							>
								<PermIdentity className="sidebarIcon" />
								Users
							</li>
						</Link>
						<Link to="/categories" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Categories' ? 'active' : ''
								}`}
							>
								<Storefront className="sidebarIcon" />
								Categories
							</li>
						</Link>
						<Link to="/products" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Products' ? 'active' : ''
								}`}
							>
								<Storefront className="sidebarIcon" />
								Products
							</li>
						</Link>
						<Link to="/orders" className="link" reloadDocument>
							<li
								className={`sidebarListItem ${
									active == 'Orders' ? 'active' : ''
								}`}
							>
								<AttachMoney className="sidebarIcon" />
								Orders
							</li>
						</Link>
					</ul>
				</div>
			</div>
		</div>
	);
}
