import React, { useState, useEffect } from 'react';
import './Slider.css';
import { AiOutlineLeft, AiOutlineRight, AiOutlinePause } from 'react-icons/ai';
import { VscDebugStart } from 'react-icons/vsc';

import { useSwipeable } from 'react-swipeable';

function Slider() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const handleNext = () => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
	};

	const handlePrev = () => {
		setActiveIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
	};

	useEffect(() => {
		const timer = setInterval(() => {
			if (!paused) {
				handleNext();
			}
		}, 3000);

		return () => clearInterval(timer);
	}, [handleNext]);

	const currentTransform = -activeIndex * 100;

	const handlers = useSwipeable({
		onSwipedLeft: () => handleNext(),
		onSwipedRight: () => handlePrev(),
	});

	return (
		<div {...handlers} className="carousel-wrapper">
			<div
				className="carousel-collection"
				style={{ transform: `translateX(${currentTransform}%)` }}
			>
				<div className="carousel-item">
					<div className="carousel-item-left">
						<img
							src="https://dangkeebs.com/cdn/shop/files/DSC05095_08234437-16ea-4175-90e3-7c241dd20974.jpg?v=1695283444&width=2000"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>DK Switch Samplers</h1>

						<p>In-stock and ready to ship</p>

						<a href="">Buy now</a>
					</div>
				</div>

				<div className="carousel-item">
					<div className="carousel-item-left">
						<img
							src="                https://dangkeebs.com/cdn/shop/files/DSC05190.png?v=1695340861&width=2000"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>DK Creamery - Birthday Cake</h1>

						<p>Shipping October 2023</p>

						<a href="">Buy now</a>
					</div>
				</div>

				<div className="carousel-item">
					<div className="carousel-item-left">
						<img
							src="https://dangkeebs.com/cdn/shop/files/M1W-SP-US-Packlist-D.webp?v=1697187878&width=2000"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>Monsgeek M1W-SP</h1>

						<p>In-stock and ready to ship</p>

						<a href="">Buy now</a>
					</div>
				</div>
			</div>

			<div className="carousel-indicators">
				<AiOutlineLeft size={26} onClick={() => handlePrev()} />
				<div className="dots-container">
					{activeIndex == 0 ? (
						<div>
							<div className="dot fill" onClick={() => setActiveIndex(0)}></div>
							<div className="dot" onClick={() => setActiveIndex(1)}></div>
							<div className="dot" onClick={() => setActiveIndex(2)}></div>
						</div>
					) : activeIndex == 1 ? (
						<div>
							<div className="dot" onClick={() => setActiveIndex(0)}></div>
							<div className="dot fill" onClick={() => setActiveIndex(1)}></div>
							<div className="dot" onClick={() => setActiveIndex(2)}></div>
						</div>
					) : (
						<div>
							<div className="dot" onClick={() => setActiveIndex(0)}></div>
							<div className="dot" onClick={() => setActiveIndex(1)}></div>
							<div className="dot fill" onClick={() => setActiveIndex(2)}></div>
						</div>
					)}
				</div>
				<AiOutlineRight
					size={26}
					onClick={() => handleNext()}
					style={{ marginRight: '2rem' }}
				/>
				{paused ? (
					<VscDebugStart size={26} onClick={() => setPaused(false)} />
				) : (
					<AiOutlinePause size={26} onClick={() => setPaused(true)} />
				)}
			</div>
		</div>
	);
}

export default Slider;
