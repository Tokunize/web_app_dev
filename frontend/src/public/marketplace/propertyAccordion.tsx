import  { useState } from 'react';
import { Documents } from './documents';
import { Activity } from './activity';
import { Finantial } from './financial';
import { Overview } from './overview';
import { PropertyFinancialData } from '@/types';  // Asegúrate de tener este tipo en su lugar
import { useGetAxiosRequest } from '@/hooks/getAxiosRequest';
import { DataAccordion } from '../../components/dataAccordion/DataAccordion';
import { Property } from '@/types';
import { TabItem } from '@/types';

interface PropertyAccordionProps {
  property_id: string;
  overviewData: Property; 
}



export const PropertyAccordion = ({ property_id, overviewData }: PropertyAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab
  
  const tabs: TabItem[] = [
    { type: "text", content: "Overview" },
    { type: "text", content: "Financial" },
    { type: "text", content: "Activity" },
    { type: "text", content: "Documents" },
  ];

  const viewType = typeof tabs[activeIndex]?.content === 'string'
  ? tabs[activeIndex].content.toLowerCase()
  : '';
  const requiresAuth = viewType === 'activity' || viewType === 'documents';

  // Obtener datos financieros usando el hook
  const { data, loading, error } = useGetAxiosRequest<PropertyFinancialData>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/single/${property_id}/?view=${viewType}`,requiresAuth
  );

  // Componentes que se renderizan por cada pestaña
  const components = [
    <Overview overviewData={overviewData} key="overview" />,
    <Finantial data={data} loading={loading} error={error} key="financial" />,
    <Activity data={data} property_id={property_id} key="activity" />,
    <Documents key="documents" />,
  ];

  const handleTabChange = (index: number) => {
    setActiveIndex(index); // Actualizar el índice activo
  };

  return (
    <>
      <DataAccordion tabs={tabs} components={components} onTabChange={handleTabChange} />
    </>
  );
};
