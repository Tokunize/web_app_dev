import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth0 } from "@auth0/auth0-react";  // Importa el hook useAuth0
import { LoadingSpinner } from "@/components/loadingSpinner";

const MainLayout: React.FC = () => {
  const { isLoading } = useAuth0();  // Obtén el estado de carga de Auth0

  // Si está cargando, mostramos un indicador de carga global
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner/>
      </div>
    );
  }

  // Si no está cargando, renderizamos el contenido principal
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen">
        <Outlet />  {/* Este es el espacio donde se cargan las rutas anidadas */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
