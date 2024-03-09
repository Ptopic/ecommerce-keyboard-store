import React from 'react';
import './Featured.css';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

// Images
import newArrivalsImage from '../../assets/new-arrivals.png';
function Featured() {
	return (
		<div className="featured-section">
			<p>Featured Collections</p>

			<div className="featured-container">
				<Link to="/products/all" className="featured-card">
					<img src={newArrivalsImage} alt="" />
					<div>
						<span>New Arrivals</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/configurator" className="featured-card">
					<img
						src="https://www.jouleperformance.com/media/.renditions/JoulePerformance/LandingPages/Configurator/joule_performance_streaming_pc_config.png"
						alt=""
					/>
					<div>
						<span>Konfigurator</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>

				<Link to="/products/Procesori?name=Procesori" className="featured-card">
					<img
						src="https://www.techspot.com/articles-info/2636/images/2023-02-27-image-15.jpg"
						alt=""
					/>
					<div>
						<span>Procesori</span>
						<AiOutlineArrowRight size={18} />
					</div>
				</Link>
			</div>
		</div>
	);
}

export default Featured;
