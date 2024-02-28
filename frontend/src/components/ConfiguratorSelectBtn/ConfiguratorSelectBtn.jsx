import React from 'react';
import './ConfiguratorSelectBtn.css';

import { FaPlus } from 'react-icons/fa6';

const ConfiguratorSelectBtn = ({
	openConfiguratorModal,
	displayName,
	categoryName,
	subCategory,
}) => {
	return (
		<button
			onClick={() =>
				openConfiguratorModal(displayName, categoryName, subCategory)
			}
		>
			<FaPlus />
			Odaberi {displayName}
		</button>
	);
};

export default ConfiguratorSelectBtn;
