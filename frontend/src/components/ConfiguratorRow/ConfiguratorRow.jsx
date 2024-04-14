import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import ConfiguratorSelectBtn from '../ConfiguratorSelectBtn/ConfiguratorSelectBtn';

// Utils
import { formatPriceDisplay } from '../../utils/formatting';
import QuantityBtn from '../QuantityBtn/QuantityBtn';
import { useDispatch } from 'react-redux';
import { removeItemFromConfiguration } from '../../redux/configuratorRedux';
import { useQueryClient } from 'react-query';

const ConfiguratorRow = ({
	configuratorModalValues,
	setConfiguratorModalValues,
	openConfiguratorModal,
	displayName,
	categoryName,
	singular,
}) => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const removeProductFromConfigurator = (id) => {
		queryClient.removeQueries((query) => query.queryKey.includes(categoryName));

		dispatch(removeItemFromConfiguration({ categoryName, id }));
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
