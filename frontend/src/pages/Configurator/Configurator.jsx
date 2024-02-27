import React, { useState, useEffect } from 'react';
import './Configurator.css';

import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Components
import Navbar from '../../components/Navbar/Navbar';
import ConfiguratorModal from './ConfiguratorModal';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

const Configurator = () => {
	const [configuratorModalValues, setConfiguratorModalValues] = useState({
		open: false,
		displayType: '',
		categoryName: '',
	});

	const openConfiguratorModal = (displayType, categoryName) => {
		setConfiguratorModalValues({
			...configuratorModalValues,
			open: !configuratorModalValues.open,
			displayType: displayType,
			categoryName: categoryName,
		});
	};

	const toggleOpenConfiugratorModal = () => {
		setConfiguratorModalValues({
			...configuratorModalValues,
			open: !configuratorModalValues.open,
		});
	};

	return (
		<div>
			<Navbar />
			<Toaster />

			{configuratorModalValues.open == true && (
				<ConfiguratorModal
					configuratorModalValues={configuratorModalValues}
					toggleOpenConfiugratorModal={toggleOpenConfiugratorModal}
					displayType={configuratorModalValues.displayType}
					categoryName={configuratorModalValues.categoryName}
				/>
			)}

			<div className="configurator-container">
				<div className="configurator-table">
					<div className="configurator-table-head">
						<div className="configurator-table-head-cell">Komponenta</div>

						<div className="configurator-table-head-cell">Selekcija</div>

						<div className="configurator-table-head-cell">Cijena</div>
					</div>

					<div className="configurator-table-body">
						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Procesori?name=Procesori">Procesor</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() => openConfiguratorModal('Procesor', 'Procesori')}
								>
									<FaPlus />
									Odaberi Procesor
								</button>
							</div>
							{/* <div className="configurator-table-body-cell price">
								€255,00 <IoClose size={32} />
							</div> */}
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/CPU%20Hladnjaci?name=CPU%20Hladnjaci">
									CPU hladnjak
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal('CPU Hladnjak', 'CPU Hladnjaci')
									}
								>
									<FaPlus />
									Odaberi CPU Hladnjak
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Vodena%20hlađenja?name=Vodena%20hlađenja">
									Vodeno hlađenje
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal('Vodeno hlađenje', 'Vodena hlađenja')
									}
								>
									<FaPlus />
									Odaberi Vodeno hlađenje
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Matične%20ploče?name=Matične%20ploče">
									Matična ploća
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal('Matičnu ploću', 'Matične ploče')
									}
								>
									<FaPlus />
									Odaberi Matičnu ploću
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Radna%20memorija%20(RAM)?name=Radna%20memorija%20(RAM)">
									RAM
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal('RAM', 'Radna memorija (RAM)')
									}
								>
									<FaPlus />
									Odaberi RAM
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Pohrana%20podataka?name=Pohrana%20podataka">
									Pohrana podataka
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal(
											'Pohranu podataka',
											'Pohrana podataka'
										)
									}
								>
									<FaPlus />
									Odaberi Pohranu podataka
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Grafičke%20kartice?name=Grafičke%20kartice">
									Grafička kartica
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal(
											'Grafičku karticu',
											'Grafičke kartice'
										)
									}
								>
									<FaPlus />
									Odaberi Grafičku karticu
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Kućišta?name=Kućišta">Kućište</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() => openConfiguratorModal('Kućište', 'Kućišta')}
								>
									<FaPlus />
									Odaberi Kućište
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Napajanja?name=Napajanja">Napajanje</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal('Napajanje', 'Napajanja')
									}
								>
									<FaPlus />
									Odaberi Napajanje
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Monitori?name=Monitori">Monitor</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() => openConfiguratorModal('Monitor', 'Monitori')}
								>
									<FaPlus />
									Odaberi Monitor
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">
								<Link to="/products/Zvučne%20kartice%20i%20Adapteri?name=Zvučne%20kartice%20i%20Adapteri">
									Zvučne kartice i Adapteri
								</Link>
							</div>
							<div className="configurator-table-body-cell">
								<button
									onClick={() =>
										openConfiguratorModal(
											'Zvučne kartice i Adaptere',
											'Zvučne kartice i Adapteri'
										)
									}
								>
									<FaPlus />
									Odaberi Zvučne kartice i Adaptere
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">Periferija</div>
							<div className="configurator-table-body-cell">
								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal(
											'Miš i Tipkovnicu',
											'Miševi i Tipkovnice'
										)
									}
								>
									<FaPlus />
									Miševi i Tipkovnice
								</button>

								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal('Slušalice', 'Slušalice')
									}
								>
									<FaPlus />
									Slušalice
								</button>

								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal(
											'Zvučnik i mikrofon',
											'Zvučnici i mikrofoni'
										)
									}
								>
									<FaPlus />
									Zvučnici i mikrofoni
								</button>

								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal('Web kamere', 'Web kamere')
									}
								>
									<FaPlus />
									Web kamere
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">Ostalo</div>
							<div className="configurator-table-body-cell">
								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal(
											'Ventilatore za kućište',
											'Ventilatori za kučišta'
										)
									}
								>
									<FaPlus />
									Ventilatori za kučišta
								</button>

								<button
									className="text-btn"
									onClick={() =>
										openConfiguratorModal('Termalnu pastu', 'Termalne paste')
									}
								>
									<FaPlus />
									Termalne paste
								</button>
							</div>
							<div className="configurator-table-body-cell">€255,00</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Configurator;
