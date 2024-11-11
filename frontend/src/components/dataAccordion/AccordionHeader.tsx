
interface AccordionTabsProps {
  activeIndex: number | null;
  onTabClick: (index: number) => void;
  tabs: string[];
}

export const AccordionHeader = ({ activeIndex, onTabClick, tabs }: AccordionTabsProps) => {
  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`p-2 border-b-2 font-bold  transition-all ease-in-out duration-300  ${activeIndex === index ? 'border-black' : 'border-transparent text text-gray-500'}`}
          onClick={() => onTabClick(index)} // Llamamos a onTabClick al hacer clic
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
