import React, { useRef } from 'react';
import './Selection.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import {
	motion,
	useScroll,
	useSpring,
	useTransform,
	MotionValue,
} from 'framer-motion';

function useParallax(value, distance) {
	return useTransform(value, [0, 1], [-distance, distance]);
}

function Selection() {
	const sectionRef = useRef(null);

	const { scrollYProgress } = useScroll({ target: sectionRef });
	const y = useParallax(scrollYProgress, 300);

	return (
		<div className="selection-section">
			<p>Our Products</p>

			<div className="selection-container">
				<div className="selection-card" ref={sectionRef}>
					<Link to="/products/keyboard?name=Keyboards">
						<img
							src="https://dangkeebs.com/cdn/shop/collections/IMG_0428.jpg?v=1615023959&width=330"
							alt=""
						/>
						<div>
							<span>Keyboards</span>
							<AiOutlineArrowRight size={18} />
						</div>
					</Link>
				</div>

				<Link to="/products/macropad?name=Macropads" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/files/DSC03412_9ba18c22-1b1b-4c2a-a98b-7fd9f98aed20.jpg?v=1692570778&width=823,https://dangkeebs.com/cdn/shop/files/DSC03413_f751a075-404e-45ea-9ee9-fca6f1c6aecb.jpg?v=1692570778&width=823,https://dangkeebs.com/cdn/shop/files/DSC03415_f365d27f-8744-4ec6-9429-93cc4190fc68.jpg?v=1692570778&width=823,https://dangkeebs.com/cdn/shop/files/DSC03320.jpg?v=1692571249&width=823,https://dangkeebs.com/cdn/shop/files/DSC03321_69e1cbe0-ef6b-4f06-a59a-9b72339220cd.jpg?v=1692571249&width=823,https://dangkeebs.com/cdn/shop/files/DSC03325_07d95383-f8d8-4c8a-9484-7e5d56461312.jpg?v=1692571249&width=823"
						alt=""
					/>
					<div>
						<span>Macropads</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/pcb?name=PCBs+And+Plates"
					className="selection-card"
				>
					<img
						src="https://dangkeebs.com/cdn/shop/collections/PCB_and_Plate_category.jpg?v=1624761645&width=330"
						alt=""
					/>
					<div>
						<span>PCBs & Plates</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/keycaps?name=Keycaps" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/IMG_0461.jpg?v=1615337210&width=330"
						alt=""
					/>
					<div>
						<span>Keycaps</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/switches?name=Switches" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/3G1A0321-6.jpg?v=1615061571&width=330"
						alt=""
					/>
					<div>
						<span>Switches</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/cables?name=Cables" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/Cable_image.jpg?v=1630961040&width=330"
						alt=""
					/>
					<div>
						<span>Cables</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/deskmats?name=Deskmats" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/IMG_8340-2.jpg?v=1603003936&width=330"
						alt=""
					/>
					<div>
						<span>Deskmats</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/tools?name=Tools" className="selection-card">
					<img
						src="https://dangkeebs.com/cdn/shop/collections/IMG_8702-2.jpg?v=1604801017&width=535"
						alt=""
					/>
					<div>
						<span>Tools</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>
			</div>
		</div>
	);
}

export default Selection;
