import { createPortal } from "react-dom";

export default function Modal({ children, onClose, zIndex = 1000 }) {
  return createPortal(
    <div
      className="modal-overlay"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>,
    document.body
  );
}
