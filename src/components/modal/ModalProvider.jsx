import { createContext, useContext, useState } from "react";
import Modal from "./Modal";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (content) => {
    setModals((prev) => [...prev, content]);
  };

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modals.map((content, index) => (
        <Modal
          key={index}
          onClose={closeModal}
          zIndex={1000 + index}
        >
          {content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
