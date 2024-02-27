import React, { useState, useEffect } from 'react';
import './Slider.css';
import { AiOutlineLeft, AiOutlineRight, AiOutlinePause } from 'react-icons/ai';
import { VscDebugStart } from 'react-icons/vsc';

import { useSwipeable } from 'react-swipeable';

import { Link } from 'react-router-dom';

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
							src="https://www.techspot.com/articles-info/2636/images/2023-02-27-image-15.jpg"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>Procesor AMD Ryzen 9 7950X3D</h1>

						<p>Shipping October 2024</p>

						<Link to={'/product/65d7d823692c5832af873d10'}>Buy now</Link>
					</div>
				</div>

				<div className="carousel-item">
					<div className="carousel-item-left">
						<img
							src="https://5.imimg.com/data5/SELLER/Default/2023/10/353704481/XI/UH/ZA/5458394/intel-core-i7-14700k-core-i7-14th-gen-20c.webp"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>Procesor Intel Core i9-14900KF</h1>

						<p>In-stock and ready to ship</p>

						<Link to={'/product/65dcc55dba2a6ad7a9ff4ec9'}>Buy now</Link>
					</div>
				</div>

				<div className="carousel-item">
					<div className="carousel-item-left">
						<img
							src="https://www.eteknix.com/wp-content/uploads/2023/05/image-56-880x533.png"
							alt=""
						/>
					</div>
					<div className="carousel-item-right">
						<h1>Grafička Gigabyte GeForce RTX4060Ti Eagle, 8GB GDDR6</h1>

						<p>In-stock and ready to ship</p>

						<Link to={'/product/65d3c813b9c7e4b6ad8322b7'}>Buy now</Link>
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
