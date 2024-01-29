import React from 'react';
import './DeleteModal.css';

function DeleteModal({ text, type, closeDeleteModal, handleDelete }) {
	return (
		<div class="modal-overlay" id="deleteModal">
			<div class="delete-modal">
				<div class="modal-header">
					<h1>Confirm Delete</h1>
				</div>
				<div class="modal-body">
					<p>
						<span id="confirmText">
							Do you want to delete {type}
							<strong>{' ' + text}</strong>
						</span>
					</p>
				</div>
				<div class="modal-footer">
					<button
						class="yes-btn"
						id="yesBtn"
						type="button"
						onClick={handleDelete}
					>
						Delete {type}
					</button>
					<button
						class="no-btn noBtn"
						data-bs-dismiss="modal"
						type="button"
						onClick={() => closeDeleteModal()}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default DeleteModal;
