import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { red } from '@mui/material/colors';
import { motion as m, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
	AiOutlineSearch,
	AiOutlineClose,
	AiOutlineUser,
	AiOutlineHeart,
	AiOutlineShopping,
} from 'react-icons/ai';
import { IoLogOutOutline } from 'react-icons/io5';

import { Link } from 'react-router-dom';
import './Navbar.css';

import Cart from '../Cart/Cart';

import logo from '../../assets/logo3.png';

import NavbarLink from './NavbarLink';
import SearchModal from '../SearchModal/SearchModal';
import Spinner from '../../../../frontend/src/components/Spinner/Spinner';

import { useNavigate } from 'react-router-dom';
import { request } from '../../api';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userRedux';
import { openCart, closeCart } from '../../redux/cartRedux';

import { useCookies } from 'react-cookie';
import { useGetCategories } from '../../hooks/useGetCategories';
import { Toaster, toast } from 'react-hot-toast';

const Navbar = () => {
	const { isLoading, data, isFetching } = useGetCategories();

	const [cookies, setCookie] = useCookies();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user.currentUser);

	const quantity = useSelector((state) => state.cart.quantity);

	const { open } = useSelector((state) => state.cart);

	const [navOpen, setNavOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);

	const toggleSearchOpen = () => {
		if (searchOpen) {
			setSearchOpen(false);
			document.body.style.overflow = 'visible';
		} else {
			setSearchOpen(true);
			document.body.style.overflow = 'hidden';
		}
	};

	const openNavbar = () => {
		setNavOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const closeNavbar = () => {
		setNavOpen(false);
		document.body.style.overflow = 'visible';
	};

	const toggleCart = () => {
		if (open) {
			dispatch(closeCart());
			document.body.style.overflow = 'visible';
		} else {
			dispatch(openCart());
			document.body.style.overflow = 'hidden';
		}
	};

	const handleLogOut = () => {
		dispatch(logout());

		// Destroy cookie
		setCookie('token', '', {
			expires: new Date(0),
			path: '/',
		});

		navigate('/');
		window.location.reload();
	};

	return (
		<nav className="navbar">
			<Toaster />
			<div className="navbar-wrapper">
				<div className="navbar-left">
					<AnimatePresence>
						{navOpen ? (
							<AiOutlineClose
								size={28}
								className="open-icon"
								onClick={() => closeNavbar()}
							/>
						) : (
							<RxHamburgerMenu
								size={28}
								className="open-icon"
								onClick={() => openNavbar()}
							/>
						)}
					</AnimatePresence>
					<Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
						{/* <h1>Switchy</h1> */}
						<img src={logo} alt="" />
					</Link>
				</div>
				<div className="navbar-right">
					{user ? (
						<div className="navbar-user-data">
							<button onClick={() => handleLogOut()}>
								<IoLogOutOutline size={26} />
							</button>
						</div>
					) : (
						<Link
							style={{
								textDecoration: 'none',
								color: 'black',
							}}
							to={'/login'}
						>
							<AiOutlineUser size={26} />
						</Link>
					)}

					{user && (
						<Link
							style={{
								textDecoration: 'none',
								color: 'black',
							}}
							to={'/user/details'}
						>
							<AiOutlineUser size={26} />
						</Link>
					)}

					<button type="button" onClick={() => toggleSearchOpen()}>
						<AiOutlineSearch size={26} />
					</button>

					<Link
						style={{ textDecoration: 'none', color: 'black' }}
						to={'/wishlist'}
					>
						<AiOutlineHeart size={26} />
					</Link>
					<div className="cart-icon" onClick={() => toggleCart()}>
						<Badge badgeContent={quantity} color="primary" scale="2">
							<AiOutlineShopping size={26} />
						</Badge>
					</div>
				</div>
			</div>

			{searchOpen && <SearchModal toggleSearchOpen={toggleSearchOpen} />}

			<AnimatePresence>
				{navOpen && (
					<m.div
						className="navbar-content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ease: 'easeInOut', duration: 0.4 }}
						exit={{
							opacity: 0,
							transition: {
								ease: 'easeInOut',
								duration: 0.4,
							},
						}}
					>
						<m.div
							className="navbar-content-text"
							initial={{ x: -80, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ ease: 'easeInOut', duration: 0.4 }}
							exit={{
								opacity: 0,
								x: -80,
								transition: {
									ease: 'easeInOut',
									duration: 0.4,
								},
							}}
						>
							{isLoading || isFetching ? (
								<Spinner />
							) : (
								<>
									<NavbarLink
										link={'/'}
										text="Home"
										closeFunction={closeNavbar}
									/>
									<NavbarLink
										link={'/configurator'}
										text="Konfigurator"
										closeFunction={closeNavbar}
									/>
									<NavbarLink
										link={'/products/all'}
										text="Svi Proizvodi"
										closeFunction={closeNavbar}
									/>

									{/* Map thru categories */}
									{!isLoading &&
										data &&
										[...data.data]
											.sort((a, b) => a.name.localeCompare(b.name))
											.map((category) => {
												return (
													<NavbarLink
														link={`/products/${category.name}?name=${category.name}`}
														text={category.name}
														closeFunction={closeNavbar}
														key={category._id}
													/>
												);
											})}

									<NavbarLink
										link={'/about'}
										text="About Us"
										closeFunction={closeNavbar}
									/>
								</>
							)}
						</m.div>
					</m.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{open && (
					<m.div
						className="navbar-content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ ease: 'easeInOut', duration: 0.4 }}
						exit={{
							opacity: 0,
							transition: {
								ease: 'easeInOut',
								duration: 0.4,
							},
						}}
					>
						<Cart />
					</m.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;
