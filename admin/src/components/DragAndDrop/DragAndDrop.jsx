import React, { useState, useEffect, useRef } from 'react';
import './DragAndDrop.css';

// Icons
import { IoClose } from 'react-icons/io5';

const DragAndDrop = ({
	onChange,
	field,
	setFieldValue,
	currentImages,
	setFiles,
}) => {
	let dropArea = useRef(null);

	const [curFiles, setCurFiles] = useState(currentImages ? currentImages : []);

	// Drag events
	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();

		dropArea.current.classList.add('highlight');
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();

		dropArea.current.classList.add('highlight');
	};

	// Drop events
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();

		dropArea.current.classList.remove('highlight');
	};

	const handleDropEvent = (e) => {
		e.preventDefault();
		e.stopPropagation();

		handleDrop(e);

		dropArea.current.classList.remove('highlight');
	};

	function handleDrop(e) {
		let dt = e.dataTransfer;
		let files = dt.files;

		transformFiles(files);
	}

	const handleManualUpload = (e) => {
		let files = e.target.files;

		transformFiles(files);
	};

	const transformFiles = async (files) => {
		if (files) {
			let transformedFiles = await Promise.all(
				Array.from(files).map(async (file) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					return new Promise((resolve) => {
						reader.onloadend = () => {
							resolve(reader.result);
						};
					});
				})
			);

			setCurFiles((prevFiles) => [...prevFiles, ...transformedFiles]);
		}
	};

	const removeUploadedImage = (e, id) => {
		const filteredArray = curFiles.filter((item, index) => index != id);
		setCurFiles(filteredArray);
	};

	useEffect(() => {
		setCurFiles(currentImages);
	}, [currentImages]);

	useEffect(() => {
		if (setFieldValue) {
			setFieldValue(field, curFiles);
		} else {
			setFiles(curFiles);
		}
	}, [curFiles]);

	return (
		<div
			className="drop-area"
			ref={dropArea}
			onDragEnter={(e) => handleDragEnter(e)}
			onDragOver={(e) => handleDragOver(e)}
			onDragLeave={(e) => handleDragLeave(e)}
			onDrop={(e) => handleDropEvent(e)}
			onChange={(e) => handleManualUpload(e)}
		>
			<div className="drop-area-content">
				<p>
					Upload multiple files with the file dialog or by dragging and dropping
					images onto the dashed region
				</p>
				<input type="file" id="fileElement" multiple accept="image/*" />
				<label className="button" htmlFor="fileElement">
					Select some files
				</label>
			</div>

			<div id="gallery">
				{curFiles.map((file, id) => {
					return (
						<div className="uploaded-image" key={id}>
							<button
								type="button"
								className="close-img-btn"
								onClick={(e) => removeUploadedImage(e, id)}
							>
								<IoClose />
							</button>
							<img src={file} alt="uploaded image" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DragAndDrop;
