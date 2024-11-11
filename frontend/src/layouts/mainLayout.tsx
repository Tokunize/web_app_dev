// components/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";

import { Footer } from "@/components/footer";


const MainLayout: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar/>
      </header>
      <main  className="min-h-screen">
        <Outlet /> 
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;
