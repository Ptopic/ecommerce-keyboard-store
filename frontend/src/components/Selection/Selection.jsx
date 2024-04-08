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
				<Link
					to="/products/Procesori?name=Procesori"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://www.techspot.com/articles-info/2636/images/2023-02-27-image-15.jpg"
						alt=""
					/>
					<div>
						<span>Procesori</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/CPU Hladnjaci?name=CPU Hladnjaci"
					className="selection-card"
					reloadDocument
				>
					<img
						src="http://res.cloudinary.com/dcxwnj5jj/image/upload/v1708787179/shop/rqxsp0l8vfdpp9zp110s.jpg"
						alt=""
					/>
					<div>
						<span>CPU Hladnjaci</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Vodena hlađenja?name=Vodena hlađenja"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://v1tech.com/cdn/shop/products/soul-of-the-retrowave-aio-cover-for-corsair-icue-elite-capellix-h100i-h115i-h150i-black-and-white-donnie-art-v1tech-700902.jpg?v=1696293036&width=416"
						alt=""
					/>
					<div>
						<span>Vodena hlađenja</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Matične ploče?name=Matične ploče"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://www.digitaltrends.com/wp-content/uploads/2023/05/Asus-RTX-4070-hidden-connectors-6.jpg?fit=720%2C480&p=1"
						alt=""
					/>
					<div>
						<span>Matične Ploče</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Radna memorija (RAM)?name=Radna memorija (RAM)"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://media.kingston.com/kingston/content/ktc-content-blog-gaming-how-much-memory-for-gaming.jpg"
						alt=""
					/>
					<div>
						<span>Radna memorija (RAM)</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Pohrana podataka?name=Pohrana podataka"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://www.zdnet.com/a/img/resize/0763eef5b93bb7f7f02869e5396ea2c1cb394877/2022/12/13/35b96396-fde4-4a9f-8402-ac13b78b243a/samsung-ssd-990-pro.jpg?auto=webp&fit=crop&height=1200&width=1200"
						alt=""
					/>
					<div>
						<span>Pohrana podataka</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Grafičke kartice?name=Grafičke kartice"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://www.slashgear.com/img/gallery/gpu-settings-that-are-ruining-your-pc-gaming-experience/intro-1674685151.webp"
						alt=""
					/>
					<div>
						<span>Grafičke Kartice</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Kućišta?name=Kućišta"
					className="selection-card"
					reloadDocument
				>
					<img
						src="http://res.cloudinary.com/dcxwnj5jj/image/upload/v1708823241/shop/zepfvbzwmoc8nomf6z7e.jpg"
						alt=""
					/>
					<div>
						<span>Kućišta</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Napajanja?name=Napajanja"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://cdn.mos.cms.futurecdn.net/7ME636bQNGEGGrg5qEtWrK.jpg"
						alt=""
					/>
					<div>
						<span>Napajanja</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Monitori?name=Monitori"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://cdn.thewirecutter.com/wp-content/media/2023/06/4kmonitors-2048px-9794.jpg"
						alt=""
					/>
					<div>
						<span>Monitori</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link
					to="/products/Ventilatori za kučišta?name=Ventilatori za kučišta"
					className="selection-card"
					reloadDocument
				>
					<img
						src="https://www.pcworld.com/wp-content/uploads/2023/11/case-fan-airflow-2-100898302-orig-1.jpg?quality=50&strip=all"
						alt=""
					/>
					<div>
						<span>Ventilatori za kučišta</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>
			</div>
		</div>
	);
}

export default Selection;
