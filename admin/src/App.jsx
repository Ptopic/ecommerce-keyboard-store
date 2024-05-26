import React, { useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import './App.css';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';

import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './redux/userRedux';
import Analytics from './pages/Analytics/Analytics';
import UserList from './pages/UserList/UserList';
import NewUser from './pages/NewUser/NewUser';
import EditUser from './pages/EditUser/EditUser';
import Categories from './pages/Categories/Categories';
import NewCategory from './pages/NewCategory/NewCategory';
import EditCategory from './pages/EditCategory/EditCategory';
import Products from './pages/Products/Products';
import NewProduct from './pages/NewProduct/NewProduct';

import NotFound from './pages/NotFound/NotFound';
import ProductVariants from './pages/ProductVariants/ProductVariants';
import EditProduct from './pages/EditProduct/EditProduct';

import { useCookies } from 'react-cookie';

import Orders from './pages/Orders/Orders';
import NewOrder from './pages/NewOrder/NewOrder';
import EditOrder from './pages/EditOrder/EditOrder';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { getQueryClient } from './shared/queryClient';

const queryClient = getQueryClient;

function App() {
	const [cookies, setCookie] = useCookies();

	const user = useSelector((state) => state.user.currentUser);
	let admin = null;

	const dispatch = useDispatch();

	useEffect(() => {
		// check if token cookie is available
		let token = cookies.tokenAdmin;

		if (token) {
			admin = user?.isAdmin;
		} else {
			// if it isnt set user data to null
			dispatch(setUserData(null));
		}
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				{user && user?.isAdmin == true ? (
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
								<Route exact path="/categories" element={<Categories />} />
								<Route exact path="/categories/add" element={<NewCategory />} />
								<Route
									exact
									path="/categories/edit/:id"
									element={<EditCategory />}
								/>
								<Route exact path="/products" element={<Products />} />
								<Route exact path="/products/add" element={<NewProduct />} />
								<Route
									excat
									path="/products/edit/:id"
									element={<EditProduct />}
								/>
								{/* <Route
								exact
								path="/products/:id/variants"
								element={<ProductVariants />}
							/> */}
								<Route exact path="/orders" element={<Orders />} />
								<Route exact path="/orders/add" element={<NewOrder />} />
								<Route exact path="/orders/edit/:id" element={<EditOrder />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</div>
					</>
				) : (
					<Routes>
						<Route exact path="/" element={<Login />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				)}
			</Router>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default App;
