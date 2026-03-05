import React from "react";
import "./ConfirmationModal.css";

/**
 * Reusable Confirmation Modal Component
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Title of the confirmation dialog
 * @param {string} message - Message body of the confirmation dialog
 * @param {string} confirmText - Text for the confirm button (default: "Yes, Continue")
 * @param {string} cancelText - Text for the cancel button (default: "No, Go Back")
 * @param {function} onConfirm - Callback when confirm button is clicked
 * @param {function} onCancel - Callback when cancel button is clicked
 * @param {string} confirmClass - CSS class for confirm button (default: "btn-confirm-yes")
 * @param {string} cancelClass - CSS class for cancel button (default: "btn-confirm-no")
 * 
 * @example
 * const [showConfirm, setShowConfirm] = useState(false);
 * 
 * <ConfirmationModal
 *   isOpen={showConfirm}
 *   title="Delete this item?"
 *   message="This action cannot be undone. Continue?"
 *   confirmText="Yes, Delete"
 *   cancelText="No, Cancel"
 *   onConfirm={() => {
 *     deleteItem();
 *     setShowConfirm(false);
 *   }}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Yes, Continue",
  cancelText = "No, Go Back",
  onConfirm,
  onCancel,
  confirmClass = "btn-confirm-yes",
  cancelClass = "btn-confirm-no",
}) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirmation-actions">
          <button 
            className={`btn ${cancelClass}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
