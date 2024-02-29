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
		let productDetails = Array.from(Object.keys(product.details));

		// If product is motherboard remove these 3 constrains
		if (
			productDetails.includes('Podnožje') &&
			productDetails.includes('Vrsta Memorije') &&
			productDetails.includes('Veličina')
		) {
			// If none are selected delete all
			if (
				configuratorModalValues['configuration']['Procesori'].length == 0 &&
				configuratorModalValues['configuration']['Radna memorija (RAM)']
					.length == 0 &&
				configuratorModalValues['configuration']['Kućišta'].length == 0
			) {
				newConfiguratorValues['Constraints'] = {};
			} else {
				delete newConfiguratorValues['Constraints'][categoryName];
			}

			// Remove only constraints of values that are not selected
			// Example.
			// Remove Podnožje if procesor is not selected
			// TODO fix this not working
			// if (
			// 	configuratorModalValues['configuration']['Procesori'].length > 0 &&
			// 	configuratorModalValues['configuration']['Radna memorija (RAM)']
			// 		.length == 0 &&
			// 	configuratorModalValues['configuration']['Kućišta'].length == 0
			// ) {
			// 	delete newConfiguratorValues['Constraints']['Podnožje'];
			// } else if (
			// 	configuratorModalValues['configuration']['Radna memorija (RAM)']
			// 		.length > 0 &&
			// 	configuratorModalValues['configuration']['Procesori'].length == 0 &&
			// 	configuratorModalValues['configuration']['Kućišta'].length == 0
			// ) {
			// 	delete newConfiguratorValues['Constraints']['Vrsta Memorije'];
			// } else if (
			// 	configuratorModalValues['configuration']['Kućišta'].length > 0 &&
			// 	configuratorModalValues['configuration']['Procesori'].length == 0 &&
			// 	configuratorModalValues['configuration']['Radna memorija (RAM)']
			// 		.length == 0
			// ) {
			// 	delete newConfiguratorValues['Constraints']['Veličina'];
			// }
		} else if (
			productDetails.includes('Podnožje') ||
			productDetails.includes('Vrsta Memorije') ||
			productDetails.includes('Veličina')
		) {
			// If maticna ploca is not selected then delete (all maticna ploca constraints are not present)
			if (
				(Object.keys(newConfiguratorValues['Constraints']).includes(
					'Podnožje'
				) &&
					Object.keys(newConfiguratorValues['Constraints']).includes(
						'Vrsta Memorije'
					) &&
					Object.keys(newConfiguratorValues['Constraints']).includes(
						'Veličina'
					)) == false
			) {
				if (product.details['Podnožje']) {
					// Pop element from object of constraints
					delete newConfiguratorValues['Constraints']['Podnožje'];
				} else if (product.details['Vrsta Memorije']) {
					delete newConfiguratorValues['Constraints']['Vrsta Memorije'];
				} else {
					delete newConfiguratorValues['Constraints']['Veličina'];
				}
			}
		} else {
			// Just remove item without touching constraints
			const filteredConfiguratorValues = Array.from(
				configuratorModalValues['configuration'][categoryName]
			).filter((_, index) => index != id);

			newConfiguratorValues['configuration'][categoryName] =
				filteredConfiguratorValues;
			newConfiguratorValues.displayType = '';
			newConfiguratorValues.categoryName = '';
			newConfiguratorValues.open = false;

			newConfiguratorValues.total -= product.price * product.quantity;

			setConfiguratorModalValues({ ...newConfiguratorValues });
			return;
		}

		const filteredConfiguratorValues = Array.from(
			configuratorModalValues['configuration'][categoryName]
		).filter((_, index) => index != id);

		newConfiguratorValues['configuration'][categoryName] =
			filteredConfiguratorValues;
		newConfiguratorValues.displayType = '';
		newConfiguratorValues.categoryName = '';
		newConfiguratorValues.open = false;

		newConfiguratorValues.total -= product.price * product.quantity;

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
						{'€' +
							formatPriceDisplay(
								configuratorModalValues['configuration'][categoryName][0]
									.price *
									configuratorModalValues['configuration'][categoryName][0]
										.quantity
							)}
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
										{'€' + formatPriceDisplay(item.price * item.quantity)}
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
