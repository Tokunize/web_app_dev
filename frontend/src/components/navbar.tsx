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


export const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { role } = useUser();

  // Handle scrolling for navbar background opacity
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Send user data to backend when authenticated
  useEffect(() => {
    const syncUserWithBackend = async (email: string, name: string, role: string) => {
      try {
        const token = await getAccessTokenSilently();
        localStorage.setItem("accessToken", token);

        const response = await fetch('http://localhost:8000/users/sync-user/', {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            role,
          }),
        });

        const responseBody = await response.json();
        
        localStorage.setItem("id",responseBody.id )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

      } catch (error) {
        console.error("Error syncing user with backend:", error);
      }
    };

    // If the user is authenticated and user object is available
    if (isAuthenticated && user) {
      const email = user.email || '';
      const name = user.name || '';
      const userRole = role || '';

      // Call the function to sync user data with backend
      syncUserWithBackend(email, name, userRole);
    }
  }, [isAuthenticated, user, role, getAccessTokenSilently]);


  // const renderAuthenticatedLinks = useMemo(() => {
  //   if (role === "owner" || role === "admin") {
  //     return <Link to="/overview/">Dashboard</Link>;
  //   } else if (role === "investor") {
  //     return <Link to="/dashboard">Dashboard</Link>;
  //   }
  //   return null;
  // }, [role]);

  // Navbar background class based on scroll position
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
        <Link to="/">Home</Link>
        <Link to="/blog/">Learn</Link>
        {isAuthenticated ? (
          <>
            <Link to="/overview/">Dashboard</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/sign-up">Sign Up</Link>
            <LoginButton />
          </>
        )}
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
              {isAuthenticated ? (
                <>
                  <Link to="/overview/">Dashboard</Link>
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
