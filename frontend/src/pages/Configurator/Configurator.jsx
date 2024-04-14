import React, { useState, useEffect } from 'react';
import './Configurator.css';

import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
	openConfigurator,
	closeConfigurator,
	resetConfiguration,
} from '../../redux/configuratorRedux';
import {
	openCart,
	addProduct,
	incrementProductQuantity,
} from '../../redux/cartRedux';

// Components
import Navbar from '../../components/Navbar/Navbar';
import ConfiguratorModal from '../../components/ConfiguratorModal/ConfiguratorModal';
import ConfiguratorRow from '../../components/ConfiguratorRow/ConfiguratorRow';
import ConfiguratorSelectBtn from '../../components/ConfiguratorSelectBtn/ConfiguratorSelectBtn';
import QuantityBtn from '../../components/QuantityBtn/QuantityBtn';
import Button from '../../components/Button/Button';
import { useQueryClient } from 'react-query';

const Configurator = () => {
	const queryClient = useQueryClient();
	const cartProducts = useSelector((state) => state.cart.products);
	const configuratorModalValues = useSelector((state) => state.configuration);

	console.log(configuratorModalValues);

	const dispatch = useDispatch();

	const openConfiguratorModal = (displayType, categoryName, subCategory) => {
		dispatch(openConfigurator({ displayType, categoryName, subCategory }));
	};

	const toggleOpenConfiugratorModal = () => {
		dispatch(closeConfigurator());
	};

	const removeProductFromConfigurator = (id, subCategory) => {
		dispatch(removeProductFromConfigurator({ id, subCategory }));
	};

	const buyConfiguration = () => {
		console.log(configuratorModalValues);
		// Loop thru products in configuration
		// Check if product is already in cart if it is just increment its quantity
		for (let configurationProductsData of Object.keys(
			configuratorModalValues['configuration']
		)) {
			for (let product of configuratorModalValues['configuration'][
				configurationProductsData
			]) {
				let quantity = product.quantity;
				// Check if quantity is greater than stock if it is display message
				if (quantity > product.stock) {
					toast.error('Quantity cannot be greater than stock');
					setIsLoading(false);
					return;
				} else {
					dispatch(addProduct({ ...product, quantity }));
					// Open cart when product is added
					dispatch(openCart());
				}
			}
		}
	};

	const handleResetConfiguration = async () => {
		toast.success('Configuration cleared');
		dispatch(resetConfiguration());

		queryClient.removeQueries('products');
		queryClient.removeQueries('configurator');
		queryClient.removeQueries('activeFilters');
		queryClient.removeQueries('activeFields');
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
					subCategory={configuratorModalValues.subCategory}
				/>
			)}

			<div className="configurator-container">
				<div className="configurator-table">
					<div className="configurator-table-head">
						<div className="configurator-table-head-cell">Komponenta</div>

						<div className="configurator-table-head-cell">Selekcija</div>

						<div className="configurator-table-head-cell">Količina</div>

						<div className="configurator-table-head-cell">Cijena</div>
					</div>

					<div className="configurator-table-body">
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Procesor'}
							categoryName={'Procesori'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'CPU Hladnjak'}
							categoryName={'CPU Hladnjaci'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Vodeno hlađenje'}
							categoryName={'Vodena hlađenja'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Matičnu ploću'}
							categoryName={'Matične ploče'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'RAM'}
							categoryName={'Radna memorija (RAM)'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Pohranu podataka'}
							categoryName={'Pohrana podataka'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Grafičku karticu'}
							categoryName={'Grafičke kartice'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Kućište'}
							categoryName={'Kućišta'}
							singular={true}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Napajanje'}
							categoryName={'Napajanja'}
							singular={true}
						/>
						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Monitor'}
							categoryName={'Monitori'}
						/>

						<ConfiguratorRow
							configuratorModalValues={configuratorModalValues}
							openConfiguratorModal={openConfiguratorModal}
							displayName={'Zvučne kartice i Adaptere'}
							categoryName={'Zvučne kartice i Adapteri'}
						/>

						<div className="configurator-table-body-row">
							<div className="configurator-table-body-cell">Periferija</div>
							<div className="configurator-table-body-cell ostalo">
								{configuratorModalValues['configuration']['Periferija'] &&
									Array.from(
										configuratorModalValues['configuration']['Periferija']
									).map((item, i) => {
										return (
											<div className="product">
												<div className="configurator-table-body-cell-data product">
													<img src={item.images[0].url} alt="" />
													<Link to={`/product/${item._id}`}>{item.title}</Link>
												</div>
												<div className="configurator-table-body-cell quantity">
													<QuantityBtn
														product={item}
														categoryName={'Periferija'}
														id={i}
														configuratorModalValues={configuratorModalValues}
													/>
												</div>
												<div className="configurator-table-body-cell price">
													<p>
														€{formatPriceDisplay(item.price * item.quantity)}
													</p>
													<IoClose
														size={32}
														onClick={() =>
															removeProductFromConfigurator(i, 'Periferija')
														}
													/>
												</div>
											</div>
										);
									})}
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
								{configuratorModalValues['configuration']['Ostalo'] &&
									Array.from(
										configuratorModalValues['configuration']['Ostalo']
									).map((item, i) => {
										return (
											<div className="product">
												<div className="configurator-table-body-cell-data product">
													<img src={item.images[0].url} alt="" />
													<Link to={`/product/${item._id}`}>{item.title}</Link>
												</div>
												<div className="configurator-table-body-cell quantity">
													<QuantityBtn
														product={item}
														categoryName={'Ostalo'}
														id={i}
														configuratorModalValues={configuratorModalValues}
													/>
												</div>
												<div className="configurator-table-body-cell price">
													<p>
														€{formatPriceDisplay(item.price * item.quantity)}
													</p>
													<IoClose
														size={32}
														onClick={() =>
															removeProductFromConfigurator(i, 'Ostalo')
														}
													/>
												</div>
											</div>
										);
									})}
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
						<div className="configurator-total">
							<div className="configurator-total-content">
								<div className="configurator-total-content-price">
									<h2>Ukupno:</h2>
									<p>€{formatPriceDisplay(configuratorModalValues.total)}</p>
								</div>
								<div className="configurator-total-content-btns">
									<button onClick={() => buyConfiguration()}>
										Kupi Konfiguraciju
									</button>
									<Button
										width={'fit-content'}
										text={'Clear Configuration'}
										onClickFunction={handleResetConfiguration}
										variant={'secondary'}
										borderColor={'#000'}
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
