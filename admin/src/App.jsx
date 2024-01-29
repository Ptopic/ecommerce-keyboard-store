import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import './App.css';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './pages/UserList/UserList';
import Login from './pages/Login/Login';

import { useSelector } from 'react-redux';
import Analytics from './pages/Analytics/Analytics';
import NewUser from './pages/newUser/NewUser';
import EditUser from './pages/EditUser/EditUser';

function App() {
	const user = useSelector((state) => state.user.currentUser);
	let admin = user?.data?.isAdmin;

	return (
		<Router>
			{user && admin ? (
				<>
					<Topbar />
					<div className="container">
						<Sidebar />
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route exact path="/analytics" element={<Analytics />} />
							<Route exact path="/users" element={<UserList />} />
							<Route exact path="/users/add" element={<NewUser />} />
							<Route exact path="/users/edit/:id" element={<EditUser />} />
						</Routes>
					</div>
				</>
			) : (
				<Routes>
					<Route exact path="/" element={<Login />} />
				</Routes>
			)}
		</Router>
	);
}

export default App;
