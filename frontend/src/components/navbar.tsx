import { AlignJustify } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { LoginButton } from "./buttons/loginButton";
import { LogoutButton } from "./buttons/logoutBtn";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { UserNavbar } from "./dashboard/useNavbar";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="flex justify-between py-4 px-2">
      <div className="ml-10">
        <img src={Logo} className="h-8" alt="Logo" />
      </div>

      <div className="hidden md:flex items-center space-x-4 mr-10">
        <Link to="/blog/">Learn</Link>
        {isAuthenticated ? (
          <UserNavbar />
        ) : (
          <>
            <Link to="/sign-up/">Sign Up</Link>
            <LoginButton />
          </>
        )}
      </div>

      <div className="md:hidden mr-5">
        <Sheet>
          <SheetTrigger>
            <AlignJustify className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="right">
            {/* Agrega un encabezado al diálogo */}
            <SheetHeader>
              <SheetTitle>Tokunize</SheetTitle> {/* Título del diálogo */}
              <SheetDescription className="hidden">Navigate through the app</SheetDescription> 
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-4">
              <Link to="/">Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/">Dashboard</Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link to="/sign-up">Sign Up</Link>
                  <LoginButton />
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
