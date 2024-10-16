import { AlignJustify } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useState, useEffect, useMemo } from "react";
import { LoginButton } from "./buttons/loginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./buttons/logoutBtn";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { useUser } from "../context/userProvider";
import { UserNavbar } from "./dashboard/useNavbar";

export const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { isAuthenticated, getAccessTokenSilently, user, isLoading } = useAuth0();
  const { role } = useUser();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

  // Set scroll position to change navbar background opacity
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user authentication status with localStorage to avoid delay
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    if (storedAuthStatus) {
      setIsUserAuthenticated(JSON.parse(storedAuthStatus));
    }

    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      setIsUserAuthenticated(true);
    } else {
      localStorage.removeItem("isAuthenticated");
      setIsUserAuthenticated(false);
    }
  }, [isAuthenticated]);

  // Sync user data with backend when authenticated
  useEffect(() => {
    const syncUserWithBackend = async (email: string, name: string, role: string) => {
      try {
        const token = await getAccessTokenSilently();
        localStorage.setItem("accessToken", token);

        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}users/sync-user/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name, role }),
        });

        const responseBody = await response.json();
        localStorage.setItem("id", responseBody.id);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error syncing user with backend:", error);
      }
    };

    if (isAuthenticated && user) {
      const email = user.email || "";
      const name = user.name || "";
      const userRole = role || "";

      syncUserWithBackend(email, name, userRole);
    }
  }, [isAuthenticated, user, role, getAccessTokenSilently]);

  const navbarClasses = useMemo(
    () =>
      `h-14 flex items-center justify-between sticky top-0 z-50 bg-white/${
        scrollPosition > 0 ? "90" : "95"
      } backdrop-blur-md border-b border-leaded transition duration-300`,
    [scrollPosition]
  );

  return (
    <nav className={navbarClasses}>
      <div className="ml-10">
        <img src={Logo} className="h-8" alt="Logo" />
      </div>

      <div className="hidden md:flex items-center space-x-4 mr-10">
        <Link to="/blog/">Learn</Link>
        {isUserAuthenticated === true ? (  // Verificar si está autenticado desde el localStorage
          <>
            <UserNavbar />
          </>
        ) : isUserAuthenticated === false && !isLoading ? (  // Si no está autenticado y no está cargando
          <>
            <Link to="/sign-up/">Sign Up</Link>
            <LoginButton />
          </>
        ) : null}  {/* Mientras carga, no muestra nada */}
      </div>

      <div className="md:hidden mr-5">
        <Sheet>
          <SheetTrigger>
            <Button variant="outline">
              <AlignJustify className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4">
              <Link to="/">Home</Link>
              <Link to="/blog/">Learn</Link>
              {isUserAuthenticated === true ? (
                <>
                  <Link to="/dashboard/">Dashboard</Link>
                  <LogoutButton />
                </>
              ) : isUserAuthenticated === false && !isLoading ? (
                <>
                  <Link to="/sign-up">Sign Up</Link>
                  <LoginButton />
                </>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
