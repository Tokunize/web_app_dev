import { AlignJustify } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { LoginButton } from "./buttons/loginButton";
import { LogoutButton } from "./buttons/logoutBtn";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { UserNavbar } from "./dashboard/useNavbar";
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";

export const Navbar = () => {

  const {isAuthenticated, loading } = useSelector((state: RootState) => state.user);

  return (
    <nav className="flex justify-between py-4 px-2">
      <div className="ml-10">
        <img src={Logo} className="h-8" alt="Logo" />
      </div>

      <div className="hidden md:flex items-center space-x-4 mr-10">
        {<div className="hidden md:flex items-center space-x-4 mr-10">
  <Link to="/blog/">Learn</Link>
  {isAuthenticated === true ? ( 
    <>
      <UserNavbar />
    </>
  ) : (
    <>
      <Link to="/sign-up/">Sign Up</Link>
      <LoginButton />
    </>
  )}
</div>} 
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

              {isAuthenticated === true ? (
                <>
                  <Link to="/dashboard/">Dashboard</Link>
                  <LogoutButton />
                </>
              ) : isAuthenticated === false && !loading ? (
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



  // Sync user authentication status with localStorage to avoid delay
  // useEffect(() => {
  //   const storedAuthStatus = localStorage.getItem("isAuthenticated");
  //   if (storedAuthStatus) {
  //     setIsUserAuthenticated(JSON.parse(storedAuthStatus));
  //   }

  //   if (isAuthenticated) {
  //     localStorage.setItem("isAuthenticated", JSON.stringify(true));
  //     setIsUserAuthenticated(true);
  //   } else {
  //     localStorage.removeItem("isAuthenticated");
  //     setIsUserAuthenticated(false);
  //   }
  // }, [isAuthenticated]);

  // Sync user data with backend when authenticated
  // useEffect(() => {
  //   const syncUserWithBackend = async (email: string, name: string, role: string) => {
  //     try {
  //       const token = await getAccessTokenSilently();
  //       localStorage.setItem("accessToken", token);

  //       const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}users/sync-user/`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, name, role }),
  //       });

  //       const responseBody = await response.json();
  //       localStorage.setItem("id", responseBody.id);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //     } catch (error) {
  //       console.error("Error syncing user with backend:", error);
  //     }
  //   };

  //   if (isAuthenticated && user) {
  //     const email = user.email || "";
  //     const name = user.name || "";
  //     const userRole = role || "";

  //     syncUserWithBackend(email, name, userRole);
  //   }
  // }, [isAuthenticated, user, role, getAccessTokenSilently]);
