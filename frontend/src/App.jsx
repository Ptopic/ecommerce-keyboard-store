import { useEffect, useState } from 'react';
import Product from './pages/Product/Product';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Success from './pages/Success/Success';
import Wishlist from './pages/Wishlist/Wishlist';
import Checkout from './pages/Checkout/Checkout';
import Payment from './pages/Payment/Payment';
import Order from './pages/Order/Order';
import UserDetails from './pages/UserDetails/UserDetails';
import UserOrders from './pages/UserOrders/UserOrders';
import UserChangePassword from './pages/UserChangePassword/UserChangePassword';
import UserRegisterThanks from './pages/UserRegisterThanks/UserRegisterThanks';
import NotFound from './pages/NotFound/NotFound';
import AllProductList from './pages/AllProductList/AllProductList';
import Configurator from './pages/Configurator/Configurator';

import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// React query
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

import { useCookies } from 'react-cookie';

import { jwtDecode } from 'jwt-decode';

// Redux
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userRedux';
import ScrollToTop from './components/ScrollToTop';
import { getQueryClient } from './shared/queryClient';

const queryClient = getQueryClient;

const App = () => {
	const [cookies, setCookie] = useCookies();
	const [stripePromise, setStripePromise] = useState(null);
	const user = useSelector((state) => state.user.currentUser);

	const dispatch = useDispatch();

	const API_URL = import.meta.env.VITE_API_URL;

	const getUserData = async (id, token) => {
		const res = await fetch(`${API_URL}user/` + id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await res.json();

		if (res.ok) {
			// Set redux user data
			dispatch(setUserData(data.data));
		}
	};

	useEffect(() => {
		// check if token cookie is available
		console.log(cookies);
		let token = cookies.token;

		if (token) {
			// Decode jwt to get user id
			const decoded = jwtDecode(token);
			let userId = decoded.id;

			// Get user data by id
			getUserData(userId, token);
		} else {
			// if it isnt set user data to null
			dispatch(setUserData(null));
		}

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
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Router>
					<ScrollToTop>
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route exact path="/configurator" element={<Configurator />} />
							<Route exact path="/products" element={<ProductList />} />
							<Route exact path="/products/all" element={<AllProductList />} />
							<Route
								exact
								path="/products/:category"
								element={<ProductList />}
							/>
							<Route exact path="/product/:id" element={<Product />} />
							<Route
								exact
								path="/login"
								element={user ? <Navigate to="/" /> : <Login />}
							/>
							<Route
								exact
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route
								exact
								path="/register"
								element={user ? <Navigate to="/" /> : <Register />}
							/>
							<Route
								exact
								path="/wishlist"
								element={!user ? <Navigate to="/login" /> : <Wishlist />}
							/>
							<Route
								exact
								path="/user/details"
								element={!user ? <Navigate to="/login" /> : <UserDetails />}
							/>
							<Route
								exact
								path="/user/orders"
								element={!user ? <Navigate to="/login" /> : <UserOrders />}
							/>
							<Route
								exact
								path="/user/changePassword"
								element={
									!user ? <Navigate to="/login" /> : <UserChangePassword />
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
					</ScrollToTop>
				</Router>
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
