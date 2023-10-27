import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import Slider from '../components/Slider/Slider';
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
			<Footer />
		</div>
	);
};

export default Home;
