import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import './App.css';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './pages/userList/UserList';
import User from './pages/user/User';
import NewUser from './pages/newUser/NewUser';
import ProductList from './pages/productList/ProductList';
import Product from './pages/product/Product';
import NewProduct from './pages/newProduct/NewProduct';
import Login from './pages/login/Login';

function App() {
	const admin = JSON.parse(
		JSON.parse(localStorage.getItem('persist:root')).user
	).currentUser.data.isAdmin;
	return (
		<Router>
			{admin ? (
				<>
					<Topbar />
					<div className="container">
						<Sidebar />
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route exact path="/users" element={<UserList />} />
							<Route exact path="/user/:userId" element={<User />} />
							<Route exact path="/newUser" element={<NewUser />} />
							<Route exact path="/products" element={<ProductList />} />
							<Route exact path="/product/:productId" element={<Product />} />
							<Route exact path="/newproduct" element={<NewProduct />} />
						</Routes>
					</div>
				</>
			) : (
				<Route exact path="/login" element={<Login />} />
			)}
		</Router>
	);
}

export default App;
