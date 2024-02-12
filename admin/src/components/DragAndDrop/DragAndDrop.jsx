import React, { useState, useEffect, useRef } from 'react';
import './DragAndDrop.css';

const DragAndDrop = ({ onChange, setFiles }) => {
	let dropArea = useRef(null);

	const [curFiles, setCurFiles] = useState([]);

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

		handleFilesSelect(files);
		transformFiles(files);
	}

	// --- Handle form submit event ---
	const handleManualUpload = (e) => {
		let files = e.target.files;

		handleFilesSelect(files);
		transformFiles(files);
	};

	const transformFiles = async (files) => {
		let transformedFiles = [...curFiles];

		if (files) {
			for (let file of files) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = () => {
					transformedFiles.push(reader.result);
				};
			}
			setCurFiles(transformedFiles);
		}
	};

	useEffect(() => {
		console.log(curFiles);
		setFiles(curFiles);
	}, [curFiles]);

	function handleFilesSelect(files) {
		[...files].forEach(previewFile);
	}

	// --- Generate uploaded file preview ---
	function previewFile(file) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			let img = document.createElement('img');
			img.src = reader.result;
			document.getElementById('gallery').appendChild(img);
		};
	}

	// Handle acctual image upload
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		setFiles(file);

		transformFile(file);
	};

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

			<div id="gallery"></div>
		</div>
	);
};

export default DragAndDrop;
