import Product from './pages/Product';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Success from './pages/Success';
import Wishlist from './pages/Wishlist';
import { useSelector } from 'react-redux';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

const App = () => {
	const user = useSelector((state) => state.user.currentUser);

	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/products" element={<ProductList />} />
				<Route exact path="/products/:category" element={<ProductList />} />
				<Route exact path="/product/:id" element={<Product />} />
				<Route
					exact
					path="/login"
					element={user.length > 0 ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					exact
					path="/forgot-password"
					element={user.length > 0 ? <Navigate to="/" /> : <ForgotPassword />}
				/>
				<Route
					exact
					path="/register"
					element={user.length > 0 ? <Navigate to="/" /> : <Register />}
				/>
				<Route
					exact
					path="/wishlist"
					element={user.length == 0 ? <Navigate to="/login" /> : <Wishlist />}
				/>
				<Route exact path="/reset-password" element={<ResetPassword />} />
				<Route exact path="/success" element={<Success />} />
			</Routes>
		</Router>
	);
};

export default App;
