import { DataAccordion } from "../dataAccordion/DataAccordion";
import { FaList } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { TabItem } from "@/types";
import RowWalletview from "./rowWalletView";
import ListWalletView from "./colWalletView";

const WalletTabView = ({ balance }: { balance: number }) => {
  
  // Definir las pestañas correctamente
  const tabs: TabItem[] = [
    {
      type: 'icon',  // Pestaña con un icono
      content: <MdDashboardCustomize />  // Icono de la cartera
    },
    {
      type: 'icon',  // Pestaña con solo texto
      content: <FaList/>
    },
  ];

  // Definir los componentes para cada pestaña
  const components = [
    <RowWalletview balance={balance}/>,
    <ListWalletView balance={balance}/>
  ];

  return (
    <div className="p-4 w-full border mb-5 rounded-lg">
      <DataAccordion 
        tabs={tabs}  // Pasamos las pestañas de tipo TabItem
        components={components}  // Pasamos los componentes de las pestañas
      />
    </div>
  );
};

export default WalletTabView;
