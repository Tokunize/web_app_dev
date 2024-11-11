import React, { useState } from "react";
import { AccordionContent } from "./AccordionContent";
import { AccordionHeader } from "./AccordionHeader";

interface DataAccordionProps {
  tabs: string[]; // Nombres de las pestañas
  components: React.ReactNode[]; // Componentes dinámicos a renderizar
}

export const DataAccordion: React.FC<DataAccordionProps> = ({ tabs, components }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Establecemos la primera pestaña como activa

  // Función para manejar el clic en las pestañas
  const handleTabClick = (index: number) => {
    // Solo cambiamos el índice si el tab activo es diferente al tab seleccionado
    if (index !== activeIndex) {
      setActiveIndex(index); // Cambiar el índice si es un tab diferente
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
      <AccordionContent activeIndex={activeIndex} components={components} />
    </div>
  );
};
