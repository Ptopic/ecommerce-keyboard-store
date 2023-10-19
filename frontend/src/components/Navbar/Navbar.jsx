import React, { useState } from 'react';
import { Badge } from '@material-ui/core';
import { motion as m, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
	AiOutlineClose,
	AiOutlineUser,
	AiOutlineHeart,
	AiOutlineShopping,
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { openCart, closeCart } from '../../redux/cartRedux';
import Cart from '../Cart';

const Navbar = () => {
	const dispatch = useDispatch();
	const [navOpen, setNavOpen] = useState(false);
	const quantity = useSelector((state) => state.cart.quantity);
	const { open } = useSelector((state) => state.cart);

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
						<h1>Switchy</h1>
					</Link>
				</div>
				<div className="navbar-right">
					<Link
						style={{ textDecoration: 'none', color: 'black' }}
						to={'/login'}
					>
						<AiOutlineUser size={26} />
					</Link>
					<Link
						style={{ textDecoration: 'none', color: 'black' }}
						to={'/wishlist'}
					>
						<AiOutlineHeart size={26} />
					</Link>
					<div className="cart-icon" onClick={() => toggleCart()}>
						<Badge badgeContent={quantity} color="secondary" scale="2">
							<AiOutlineShopping size={26} />
						</Badge>
					</div>
				</div>
			</div>

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
							<Link to="/products?new=new&name=New+Arrivals">New Arrivals</Link>
							<Link to="/products/best?name=Best+Sellers">Best Sellers</Link>
							<Link to="/products/keyboard?name=Keyboards">Keyboards</Link>
							<Link to="/products/macropad?name=Macropads">MacroPads</Link>
							<Link to="/products/pcb?name=PCBs+And+Plates">PCB & Plates</Link>
							<Link to="/products/keycaps?name=Keycaps">Keycaps</Link>
							<Link to="/products/switches?name=Switches">Switches</Link>
							<Link to="/products/cables?name=Cables">Cables</Link>
							<Link to="/products/deskmats?name=Deskmats">Deskmats</Link>
							<Link to="/products/tools?name=Tools">Tools</Link>
							<Link to="/about">About Us</Link>
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
