import React from 'react';
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
		const filteredConfiguratorValues = Array.from(
			configuratorModalValues[categoryName]
		).filter((_, index) => index != id);

		setConfiguratorModalValues({
			...configuratorModalValues,
			[categoryName]: filteredConfiguratorValues,
			displayType: '',
			categoryName: '',
			open: false,
		});
	};

	const renderRowData = () => {
		if (
			configuratorModalValues[categoryName] != null &&
			Array.from(configuratorModalValues[categoryName]).length > 0 &&
			singular == true
		) {
			return (
				<>
					<div className="configurator-table-body-cell-data product">
						<img
							src={configuratorModalValues[categoryName][0].images[0].url}
							alt=""
						/>
						<Link
							to={`/product/${configuratorModalValues[categoryName][0]._id}`}
						>
							{configuratorModalValues[categoryName][0].title}
						</Link>
					</div>
					<div className="configurator-table-body-cell price">
						€
						{formatPriceDisplay(configuratorModalValues[categoryName][0].price)}
						<IoClose
							size={32}
							onClick={() => removeProductFromConfigurator(0)}
						/>
					</div>
				</>
			);
		} else if (
			configuratorModalValues[categoryName] != null &&
			Array.from(configuratorModalValues[categoryName]).length > 0
		) {
			return (
				<>
					<div className="configurator-table-body-cell-data multiple">
						{Array.from(configuratorModalValues[categoryName]).map(
							(item, i) => {
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
							}
						)}
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
