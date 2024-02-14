import React, { useState, useEffect } from 'react';

import './VariantImagesModal.css';

// Icons
import { IoClose } from 'react-icons/io5';
import DragAndDrop from '../DragAndDrop/DragAndDrop';

const VariantImagesModal = ({
	id,
	currentImages,
	setImagesModalVisible,
	field,
	setFieldValue,
}) => {
	const closeModal = () => {
		setImagesModalVisible(false);
	};

	return (
		<div className="modal-overlay">
			<div className="add-variant-images-modal">
				<div className="images-modal-header">
					<h1>Upload Images</h1>

					<button
						type="button"
						className="close-btn"
						onClick={() => closeModal()}
					>
						<IoClose />
					</button>
				</div>
				<div className="images-modal-body">
					<DragAndDrop
						currentImages={currentImages}
						field={field}
						setFieldValue={setFieldValue}
					/>
				</div>
				<div className="images-modal-footer">
					<button onClick={() => closeModal()}>Save Images</button>
				</div>
			</div>
		</div>
	);
};

export default VariantImagesModal;
