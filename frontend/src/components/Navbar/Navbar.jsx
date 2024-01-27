import React, { useState } from 'react';
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
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userRedux';
import { openCart, closeCart } from '../../redux/cartRedux';
import Cart from '../Cart/Cart';

import logo from '../../assets/logo3.png';

import NavbarLink from './NavbarLink';
import SearchModal from '../SearchModal/SearchModal';

const Navbar = () => {
	const dispatch = useDispatch();
	const [navOpen, setNavOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const user = useSelector((state) => state.user.currentUser);
	const quantity = useSelector((state) => state.cart.quantity);
	const { open } = useSelector((state) => state.cart);

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
		window.location.reload();
	};

	return (
		<nav className="navbar">
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
					{user.data ? (
						<div className="navbar-user-data">
							<p>{user.data.username}</p>
							<button onClick={() => handleLogOut()}>Logout</button>
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

					{user.data && (
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
							<NavbarLink link={'/'} text="Home" closeFunction={closeNavbar} />
							<NavbarLink
								link={'/products?new=newest&name=New+Arrivals'}
								text="New Arrivals"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/best?name=Best+Sellers'}
								text="Best Sellers"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/keyboard?name=Keyboards'}
								text="Keyboards"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/macropad?name=Macropads'}
								text="MacroPads"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/pcb?name=PCBs+And+Plates'}
								text="PCB & Plates"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/keycaps?name=Keycaps'}
								text="Keycaps"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/switches?name=Switches'}
								text="Switches"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/cables?name=Cables'}
								text="Cables"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/deskmats?name=Deskmats'}
								text="Deskmats"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/products/tools?name=Tools'}
								text="Tools"
								closeFunction={closeNavbar}
							/>
							<NavbarLink
								link={'/about'}
								text="About Us"
								closeFunction={closeNavbar}
							/>
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
