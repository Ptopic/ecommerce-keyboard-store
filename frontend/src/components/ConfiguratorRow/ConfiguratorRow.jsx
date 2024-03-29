import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import ConfiguratorSelectBtn from '../ConfiguratorSelectBtn/ConfiguratorSelectBtn';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';
import QuantityBtn from '../QuantityBtn/QuantityBtn';

const ConfiguratorRow = ({
	configuratorModalValues,
	setConfiguratorModalValues,
	openConfiguratorModal,
	displayName,
	categoryName,
	singular,
}) => {
	const removeProductFromConfigurator = (id) => {
		let newConfiguratorValues = configuratorModalValues;

		// Remove product constraints
		let rowItems = null;

		if (newConfiguratorValues['configuration'][categoryName] != null) {
			rowItems = Array.from(
				configuratorModalValues['configuration'][categoryName]
			);
		}

		let product = rowItems[id];

		const filteredConfiguratorValues = Array.from(
			configuratorModalValues['configuration'][categoryName]
		).filter((_, index) => index != id);

		newConfiguratorValues['configuration'][categoryName] =
			filteredConfiguratorValues;
		newConfiguratorValues.displayType = '';
		newConfiguratorValues.categoryName = '';
		newConfiguratorValues.open = false;

		newConfiguratorValues.total -= product.price * product.quantity;

		// Remove all constraints then remap them from remaining products (cpu, ram, motherboard or case)
		newConfiguratorValues['Constraints'] = {};

		// Get all products with constraints
		for (let category of Object.keys(newConfiguratorValues['configuration'])) {
			if (
				category == 'Procesori' ||
				category == 'Matične ploče' ||
				category == 'Radna memorija (RAM)' ||
				category == 'Kućišta'
			) {
				let productsFromCategory =
					newConfiguratorValues['configuration'][category];

				// Loop thru products
				for (let product of productsFromCategory) {
					let productDetails = Array.from(Object.keys(product.details));

					if (
						productDetails.includes('Podnožje') &&
						productDetails.includes('Vrsta Memorije') &&
						productDetails.includes('Veličina')
					) {
						newConfiguratorValues['Constraints']['Podnožje'] =
							product.details['Podnožje'];
						newConfiguratorValues['Constraints']['Vrsta Memorije'] =
							product.details['Vrsta Memorije'];
						newConfiguratorValues['Constraints']['Veličina'] =
							product.details['Veličina'];
					} else if (
						productDetails.includes('Podnožje') ||
						productDetails.includes('Vrsta Memorije') ||
						productDetails.includes('Veličina')
					) {
						if (product.details['Podnožje']) {
							newConfiguratorValues['Constraints']['Podnožje'] =
								product.details['Podnožje'];
						} else if (product.details['Vrsta Memorije']) {
							newConfiguratorValues['Constraints']['Vrsta Memorije'] =
								product.details['Vrsta Memorije'];
						} else {
							newConfiguratorValues['Constraints']['Veličina'] =
								product.details['Veličina'];
						}
					}
				}
			}
		}

		setConfiguratorModalValues({ ...newConfiguratorValues });
	};

	const renderRowData = () => {
		if (
			configuratorModalValues['configuration'][categoryName] != null &&
			Array.from(configuratorModalValues['configuration'][categoryName])
				.length > 0 &&
			singular == true
		) {
			return (
				<>
					<div className="configurator-table-body-cell-data product">
						<img
							src={
								configuratorModalValues['configuration'][categoryName][0]
									.images[0].url
							}
							alt=""
						/>
						<Link
							to={`/product/${configuratorModalValues['configuration'][categoryName][0]._id}`}
						>
							{configuratorModalValues['configuration'][categoryName][0].title}
						</Link>
					</div>
					<div className="configurator-table-body-cell quantity">
						<QuantityBtn
							product={
								configuratorModalValues['configuration'][categoryName][0]
							}
							categoryName={categoryName}
							id={0}
							configuratorModalValues={configuratorModalValues}
							setConfiguratorModalValues={setConfiguratorModalValues}
						/>
					</div>
					<div className="configurator-table-body-cell price">
						<p>
							{'€' +
								formatPriceDisplay(
									configuratorModalValues['configuration'][categoryName][0]
										.price *
										configuratorModalValues['configuration'][categoryName][0]
											.quantity
								)}
						</p>
						<IoClose
							size={32}
							onClick={() => removeProductFromConfigurator(0)}
						/>
					</div>
				</>
			);
		} else if (
			configuratorModalValues['configuration'][categoryName] != null &&
			Array.from(configuratorModalValues['configuration'][categoryName])
				.length > 0
		) {
			return (
				<>
					<div className="configurator-table-body-cell-data multiple">
						{Array.from(
							configuratorModalValues['configuration'][categoryName]
						).map((item, i) => {
							return (
								<>
									<div className="configurator-table-body-cell-data product">
										<img src={item.images[0].url} alt="" />
										<Link to={`/product/${item._id}`}>{item.title}</Link>
									</div>
									<div className="configurator-table-body-cell quantity">
										<QuantityBtn
											product={item}
											categoryName={categoryName}
											id={i}
											configuratorModalValues={configuratorModalValues}
											setConfiguratorModalValues={setConfiguratorModalValues}
										/>
									</div>
									<div className="configurator-table-body-cell price">
										<p>
											{'€' + formatPriceDisplay(item.price * item.quantity)}
										</p>
										<IoClose
											size={32}
											onClick={() => removeProductFromConfigurator(i)}
										/>
									</div>
								</>
							);
						})}
						<ConfiguratorSelectBtn
							openConfiguratorModal={openConfiguratorModal}
							displayName={displayName}
							categoryName={categoryName}
						/>
					</div>
				</>
			);
		} else {
			return (
				<div className="configurator-table-body-cell">
					<ConfiguratorSelectBtn
						openConfiguratorModal={openConfiguratorModal}
						displayName={displayName}
						categoryName={categoryName}
					/>
				</div>
			);
		}
	};
	return (
		<div
			className={
				singular
					? 'configurator-table-body-row'
					: 'configurator-table-body-row multiple'
			}
		>
			<div className="configurator-table-body-cell">
				<Link to={`/products/${categoryName}?name=${categoryName}`}>
					{displayName}
				</Link>
			</div>
			{renderRowData()}
		</div>
	);
};

export default ConfiguratorRow;
