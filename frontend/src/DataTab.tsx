import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  label: string; // Texto que se muestra en el tab
  value: string; // Identificador único del tab
  content: React.ReactNode; // Contenido del tab
}

interface DataTabProps {
  tabs: Tab[];
  defaultTab?: string; 
  width?: string; 
}

export const DataTab = ({ tabs, defaultTab, width = "w-[400px]" }: DataTabProps) => {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.value} className={width}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
