import React, { useState, useEffect } from 'react';

import './AddFieldModal.css';

// Icons
import { IoClose } from 'react-icons/io5';
import InputField from '../../../../frontend/src/components/InputField/InputField';

// Data
import { fields } from '../../utils/fields.json';

const AddFieldModal = ({
	closeModal,
	selectedFields,
	setSelectedFields,
	latestIndex,
	setLatestIndex,
}) => {
	const [fieldsData, setFieldsData] = useState(fields);
	const [fieldName, setFieldName] = useState('');

	// When field name changes search for field name or create new if it doesnt exist
	useEffect(() => {
		// If search is empty set fields to all fields
		if (fieldName === '') {
			setFieldsData(fields);
		} else {
			// Filter fields by field name
			const newFieldData = fieldsData.filter((field) =>
				field.name.includes(fieldName)
			);
			setFieldsData([...newFieldData]);
		}
	}, [fieldName]);

	// Handle add
	const handleAddField = () => {
		setSelectedFields([
			...selectedFields,
			{ id: latestIndex, name: fieldName },
		]);

		let newIndex = (latestIndex += 1);
		setLatestIndex(newIndex);
	};

	// Handle field click
	const handleFieldClick = (name) => {
		setSelectedFields([...selectedFields, { id: latestIndex, name: name }]);

		// Remove used filters from list
		let filteredFieldsData = fieldsData.filter((filter) => filter.name != name);

		setFieldsData(filteredFieldsData);

		let newIndex = (latestIndex += 1);
		setLatestIndex(newIndex);
	};

	// When modal loads remove already used filters
	useEffect(() => {
		// Create names array of selected fields array
		let selectedArrayNames = selectedFields.map((el) => el.name);
		console.log(selectedArrayNames);

		// Filter fields array
		let newFieldsData = fieldsData.filter(
			(field) => !selectedArrayNames.includes(field.name)
		);

		setFieldsData(newFieldsData);
	}, []);

	return (
		<div className="modal-overlay" id="addFieldModal">
			<div className="add-field-modal">
				<div className="field-modal-header">
					<h1>Select Field</h1>

					<button
						type="button"
						className="close-btn"
						onClick={() => closeModal()}
					>
						<IoClose />
					</button>
				</div>
				<div className="field-modal-body">
					<div className="add-new-field-container">
						<InputField
							type={'text'}
							name={'name'}
							placeholder={'Field Name'}
							value={fieldName}
							onChange={(e) => setFieldName(e.target.value)}
						/>
						<button type="button" onClick={() => handleAddField()}>
							+
						</button>
					</div>

					<div style={{ marginTop: '2rem' }}>
						<h2>Fields:</h2>
						<div className="seperator-line"></div>
					</div>

					<div className="fields-list-container">
						<div className="fields-list">
							{fieldsData.length != 0 ? (
								fieldsData.map((field, id) => {
									return (
										<div
											className="filter-field"
											onClick={() => handleFieldClick(field.name)}
											key={id}
										>
											<h2>{field.name}</h2>
										</div>
									);
								})
							) : (
								<h2>No Fields Found</h2>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddFieldModal;
