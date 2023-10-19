import React, { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import Products from '../components/Products';
import Slider from '../components/Slider';
import Featured from '../components/Featured/Featured';
import Offer from '../components/Offer/Offer';
import Selection from '../components/Selection/Selection';

const Home = () => {
	return (
		<div>
			<Navbar />
			<Slider />
			<Featured />
			<Selection />
			<Offer />

			{/* <Categories />
			<Products /> */}
			<Footer />
		</div>
	);
};

export default Home;
