import { columns } from "./components/columns/columns"
import { DataTable } from "./components/data-table"
import { z } from "zod"
import { propertySchema } from "./data/schema";

// Define tus datos de tareas directamente como un objeto de JavaScript.
// Asegúrate de que el esquema zod requiere estos campos y sus tipos.
// Esto es solo un ejemplo. Ajusta los valores según tu esquema `taskSchema`.
const properties = [
  {
    id: "1",
    title: "Luxury Apartment in Downtown",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Downtown, City A",
    status: "under review",
    label: "feature",
    priority: "high",
    listingPrice: "500000",
    ownership: "75",
    listingDate: "2023-01-15",
    capRate: "5.6%",
  },
  {
    id: "2",
    title: "Modern Studio in Suburb",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Suburb, City B",
    status: "published",
    label: "feature",
    priority: "medium",
    listingPrice: "300000",
    ownership: "45",
    listingDate: "2023-02-20",
    capRate: "6.1%",
  },
  {
    id: "3",
    title: "Beach House with Ocean View",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Seaside, City C",
    status: "coming soon",
    label: "feature",
    priority: "high",
    listingPrice: "1200000",
    ownership: "50",
    listingDate: "2023-03-10",
    capRate: "4.8%",
  },
  {
    id: "4",
    title: "Cozy Cabin in the Woods",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Forest, City D",
    status: "rejected",
    label: "feature",
    priority: "low",
    listingPrice: "150000",
    ownership: "65",
    listingDate: "2023-04-05",
    capRate: "7.2%",
  },
  {
    id: "5",
    title: "Penthouse with City Skyline",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Uptown, City E",
    status: "active",
    label: "feature",
    priority: "high",
    listingPrice: "2000000",
    ownership: "80",
    listingDate: "2023-05-12",
    capRate: "3.9%",
  },
];


// Valida los datos de las tareas usando zod
const parsedProperties = z.array(propertySchema).parse(properties)

export default function TaskPage() {
  return (
    <div className="hidden h-full flex-1 flex-col  space-y-8 px-[20px] py-4 md:flex">
      <DataTable data={parsedProperties} columns={columns} />
    </div>
  )
}
