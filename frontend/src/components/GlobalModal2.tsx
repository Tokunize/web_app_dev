// GlobalModal.js
import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // Importar el ícono de cierre

// Definir la interfaz de los props (si usas TypeScript)
interface GlobalModalProps {
  isOpen: boolean;
  closeModal: () => void;
  customStyles?: React.CSSProperties;
  children: React.ReactNode;
}

// Componente GlobalModal
export const GlobalModal: React.FC<GlobalModalProps> = ({ isOpen, closeModal, customStyles, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out"
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 relative max-w-lg w-full mx-4 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        style={customStyles}
      >
        {/* Botón de cierre en la esquina superior derecha */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Contenido dinámico del modal */}
        <div className="modal-body mb-4">{children}</div>
      </div>
    </div>
  );
};
