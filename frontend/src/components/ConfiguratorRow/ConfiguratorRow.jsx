import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import ConfiguratorSelectBtn from '../ConfiguratorSelectBtn/ConfiguratorSelectBtn';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';

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

		console.log(
			Object.keys(newConfiguratorValues['Constraints']).includes('Podnožje')
		);
		console.log(
			Object.keys(newConfiguratorValues['Constraints']).includes(
				'Vrsta Memorije'
			)
		);
		console.log(
			Object.keys(newConfiguratorValues['Constraints']).includes('Veličina')
		);

		// If product is motherboard remove these 3 constrains
		if (
			productDetails.includes('Podnožje') &&
			productDetails.includes('Vrsta Memorije') &&
			productDetails.includes('Veličina')
		) {
			newConfiguratorValues['Constraints'] = {};
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
					<div className="configurator-table-body-cell price">
						€
						{formatPriceDisplay(
							configuratorModalValues['configuration'][categoryName][0].price
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
									<div className="configurator-table-body-cell price">
										€{formatPriceDisplay(item.price)}
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
