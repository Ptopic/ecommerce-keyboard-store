import React, { useState, useEffect } from 'react';
import './Configurator.css';

import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';

// Components
import Navbar from '../../components/Navbar/Navbar';
import ConfiguratorModal from '../../components/ConfiguratorModal/ConfiguratorModal';
import ConfiguratorRow from '../../components/ConfiguratorRow/ConfiguratorRow';
import ConfiguratorSelectBtn from '../../components/ConfiguratorSelectBtn/ConfiguratorSelectBtn';

const Configurator = () => {
	const [configuratorModalValues, setConfiguratorModalValues] = useState({
		open: false,
		displayType: '',
		categoryName: '',
		configuration: [],
	});

	const openConfiguratorModal = (displayType, categoryName, subCategory) => {
		setConfiguratorModalValues({
			...configuratorModalValues,
			open: !configuratorModalValues.open,
			displayType: displayType,
			categoryName: categoryName,
			subCategory: subCategory ? subCategory : null,
		});
	};

	const toggleOpenConfiugratorModal = () => {
		setConfiguratorModalValues({
			...configuratorModalValues,
			open: !configuratorModalValues.open,
		});
	};

	const removeProductFromConfigurator = (id, subCategory) => {
		const filteredConfiguratorValues = Array.from(
			configuratorModalValues[subCategory]
		).filter((_, index) => index != id);

		setConfiguratorModalValues({
			...configuratorModalValues,
			[subCategory]: filteredConfiguratorValues,
			displayType: '',
			categoryName: '',
			open: false,
		});
	};

	return (
		<div>
			<Navbar />
			<Toaster />

			{configuratorModalValues.open == true && (
				<ConfiguratorModal
					configuratorModalValues={configuratorModalValues}
					setConfiguratorModalValues={setConfiguratorModalValues}
					toggleOpenConfiugratorModal={toggleOpenConfiugratorModal}
					displayType={configuratorModalValues.displayType}
					categoryName={configuratorModalValues.categoryName}
					subCategory={configuratorModalValues.subCategory}
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
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Procesor'}
							categoryName={'Procesori'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'CPU Hladnjak'}
							categoryName={'CPU Hladnjaci'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Vodeno hlađenje'}
							categoryName={'Vodena hlađenja'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Matičnu ploću'}
							categoryName={'Matične ploče'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'RAM'}
							categoryName={'Radna memorija (RAM)'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Pohranu podataka'}
							categoryName={'Pohrana podataka'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Grafičku karticu'}
							categoryName={'Grafičke kartice'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Kućište'}
							categoryName={'Kućišta'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Napajanje'}
							categoryName={'Napajanja'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Monitor'}
							categoryName={'Monitori'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Zvučne kartice i Adaptere'}
							categoryName={'Zvučne kartice i Adapteri'}
						/>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">Periferija</div>
							<div className="configurator-table-body-cell ostalo">
								{configuratorModalValues['Periferija'] &&
									Array.from(configuratorModalValues['Periferija']).map(
										(item, i) => {
											return (
												<div className="product">
													<div className="configurator-table-body-cell-data product">
														<img src={item.images[0].url} alt="" />
														<Link to={`/product/${item._id}`}>
															{item.title}
														</Link>
													</div>
													<div className="configurator-table-body-cell price">
														€{formatPriceDisplay(item.price)}
														<IoClose
															size={32}
															onClick={() =>
																removeProductFromConfigurator(i, 'Periferija')
															}
														/>
													</div>
												</div>
											);
										}
									)}
								<div className="buttons">
									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Miš i Tipkovnicu'}
										categoryName={'Miševi i Tipkovnice'}
										subCategory={'Periferija'}
									/>

									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Slušalice'}
										categoryName={'Slušalice'}
										subCategory={'Periferija'}
									/>

									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Zvučnik i mikrofon'}
										categoryName={'Zvučnici i mikrofoni'}
										subCategory={'Periferija'}
									/>

									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Web kamere'}
										categoryName={'Web kamere'}
										subCategory={'Periferija'}
									/>
								</div>
							</div>
						</div>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">Ostalo</div>
							<div className="configurator-table-body-cell ostalo">
								{configuratorModalValues['Ostalo'] &&
									Array.from(configuratorModalValues['Ostalo']).map(
										(item, i) => {
											return (
												<div className="product">
													<div className="configurator-table-body-cell-data product">
														<img src={item.images[0].url} alt="" />
														<Link to={`/product/${item._id}`}>
															{item.title}
														</Link>
													</div>
													<div className="configurator-table-body-cell price">
														€{formatPriceDisplay(item.price)}
														<IoClose
															size={32}
															onClick={() =>
																removeProductFromConfigurator(i, 'Ostalo')
															}
														/>
													</div>
												</div>
											);
										}
									)}
								<div className="buttons">
									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Ventilatore za kućište'}
										categoryName={'Ventilatori za kučišta'}
										subCategory={'Ostalo'}
									/>

									<ConfiguratorSelectBtn
										openConfiguratorModal={openConfiguratorModal}
										displayName={'Termalnu pastu'}
										categoryName={'Termalne paste'}
										subCategory={'Ostalo'}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Configurator;
