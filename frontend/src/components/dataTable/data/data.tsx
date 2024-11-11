import {
    CheckCircle,
    Circle,
    CircleOff,
    HelpCircle,
    Timer,
    FolderKanban,
  } from "lucide-react"
  import { Home, Briefcase, Factory, Building, ShoppingBag, Hotel, Server, Package, Users } from "lucide-react";

  
  export const labels = [
    {
      value: "bug",
      label: "Bug",
    },
    {
      value: "feature",
      label: "Feature",
    },
    {
      value: "documentation",
      label: "Documentation",
    },
  ]
  
  export const statuses = [
    {
      value: "under_review",
      label: "Under Review",
      icon: HelpCircle,
    },
    {
      value: "active",
      label: "Active",
      icon: Circle,
    },
    {
      value: "coming_soon",
      label: "Coming Soon",
      icon: Timer,
    },
    {
      value: "published",
      label: "Published",
      icon: CheckCircle,
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: CircleOff,
    },
  ]
  
  export const investmentCategories = [
    {
      label: "Opportunistic",
      value: "Opportunistic",
      icon: FolderKanban,
    },
    {
      label: "Core",
      value: "Core",
      icon: Building,
    },
  ]



  export const propertyType = [
    {
      value: "multifamily",
      label: "Multifamily",
      icon: Home, // Icono para viviendas multifamiliares
    },
    {
      value: "office",
      label: "Office",
      icon: Briefcase, // Icono para oficinas
    },
    {
      value: "industrial",
      label: "Industrial",
      icon: Factory, // Icono para propiedades industriales
    },
    {
      value: "mixed_use",
      label: "Mixed Use",
      icon: Building, // Icono para propiedades de uso mixto
    },
    {
      value: "retail",
      label: "Retail",
      icon: ShoppingBag, // Icono para propiedades comerciales
    },
    {
      value: "hospitality",
      label: "Hospitality",
      icon: Hotel, // Icono para propiedades de hospitalidad (hoteles)
    },
    {
      value: "data_centre",
      label: "Data Centre",
      icon: Server, // Icono para centros de datos
    },
    {
      value: "warehouse",
      label: "Warehouse",
      icon: Package, // Icono para almacenes
    },
    {
      value: "student_housing",
      label: "Student Housing",
      icon: Users, // Icono para viviendas estudiantiles
    },
  ];


  export const performanceStatus = [
    {
        value: "Best Performance",
        label: "Best Performance",
        // icon: Users, // Icono para viviendas estudiantiles
    },
    {
        value: "Worst Performance",
        label: "Worst Performance",
        // icon: Users, // Icono para viviendas estudiantiles
    },
];
