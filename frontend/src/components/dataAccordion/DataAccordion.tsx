import React, { useState } from "react";
import { AccordionContent } from "./AccordionContent";
import { AccordionHeader } from "./AccordionHeader";

interface DataAccordionProps {
  tabs: string[]; // Nombres de las pestañas
  components: React.ReactNode[]; // Componentes dinámicos a renderizar
  onTabChange: (index: number) => void; // Callback para enviar el índice al padre
}

export const DataAccordion: React.FC<DataAccordionProps> = ({ tabs, components, onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Establecemos la primera pestaña como activa

  // Función para manejar el clic en las pestañas
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {      
      setActiveIndex(index); // Cambiar el índice si es un tab diferente
      onTabChange(index); // Notificar al padre sobre el cambio de índice
    }
  };

  return (
    <div className="w-full">
      {/* Usamos AccordionHeader para renderizar las pestañas */}
      <AccordionHeader
        tabs={tabs}
        activeIndex={activeIndex}
        onTabClick={handleTabClick}
      />

      {/* Renderizamos el contenido del acordeón según el índice activo */}
      <div className="grid grid-cols-1 gap-4">
        <AccordionContent activeIndex={activeIndex} components={components} />
      </div>
    </div>
  );
};
