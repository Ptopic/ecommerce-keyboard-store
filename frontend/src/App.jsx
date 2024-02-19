import { useEffect, useState } from 'react';
import Product from './pages/Product';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Success from './pages/Success';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Order from './pages/Order';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import UserDetails from './pages/UserDetails';
import UserOrders from './pages/UserOrders';
import UserChangePassword from './pages/UserChangePassword';
import UserRegisterThanks from './pages/UserRegisterThanks';
import NotFound from './pages/NotFound';
import AllProductList from './pages/AllProductList';

const App = () => {
	const [stripePromise, setStripePromise] = useState(null);
	const user = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		setStripePromise(
			loadStripe(
				'pk_test_51NzTW3CbgJlRmRdknFU2YQUNpvZslhliNO4CfK9EhxNWPz3f5e7HLAunH27UJOXnkyZI1NjjE3apVdHvYhdYiQNG00W3TfKPTI'
			)
		);
	}, []);

	// Mui theme
	const theme = createTheme({
		palette: {
			primary: {
				light: '#757ce8',
				main: '#E81123',
				dark: '#002884',
				contrastText: '#fff',
			},
			secondary: {
				light: '#ff7961',
				main: '#f44336',
				dark: '#ba000d',
				contrastText: '#000',
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/products" element={<ProductList />} />
					<Route exact path="/products/all" element={<AllProductList />} />
					<Route exact path="/products/:category" element={<ProductList />} />
					<Route exact path="/product/:id" element={<Product />} />
					<Route
						exact
						path="/login"
						element={user?.length > 0 ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						exact
						path="/forgot-password"
						element={
							user?.length > 0 ? <Navigate to="/" /> : <ForgotPassword />
						}
					/>
					<Route
						exact
						path="/register"
						element={user?.length > 0 ? <Navigate to="/" /> : <Register />}
					/>
					<Route
						exact
						path="/wishlist"
						element={
							user?.length == 0 ? <Navigate to="/login" /> : <Wishlist />
						}
					/>
					<Route
						exact
						path="/user/details"
						element={
							user?.length == 0 ? <Navigate to="/login" /> : <UserDetails />
						}
					/>
					<Route
						exact
						path="/user/orders"
						element={
							user?.length == 0 ? <Navigate to="/login" /> : <UserOrders />
						}
					/>
					<Route
						exact
						path="/user/changePassword"
						element={
							user?.length == 0 ? (
								<Navigate to="/login" />
							) : (
								<UserChangePassword />
							)
						}
					/>
					<Route
						exact
						path="/user/registerThanks"
						element={<UserRegisterThanks />}
					/>
					<Route exact path="/reset-password" element={<ResetPassword />} />
					<Route exact path="/success" element={<Success />} />
					<Route exast path="/checkout" element={<Checkout />} />
					<Route
						exast
						path="/payment"
						element={<Payment stripePromise={stripePromise} />}
					/>
					<Route exact path="/order/:id" element={<Order />} />

					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
};

export default App;
