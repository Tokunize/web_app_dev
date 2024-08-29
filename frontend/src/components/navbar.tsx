import { AlignJustify } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { useState, useEffect } from "react"
import { LoginButton } from "./buttons/loginButton"
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./buttons/logoutBtn";
import { Link } from "react-router-dom";
import {SignUpButton} from "./buttons/signupButton";
import Logo from "../assets/img/logo.jpg"

export const Navbar = () =>{

    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
    const { isAuthenticated } = useAuth0();

  return (
    <nav
      className={`h-14 flex items-center justify-between sticky top-0 z-50 bg-white/${scrollPosition > 0 ? '90' : '95'} backdrop-blur-md border-b border-leaded transition duration-300`}
    >
      <div className='ml-10'>
        <img src={Logo} className='h-8'/>
      </div>
      <div className="flex hidden md:block mr-10">
        <ul className="space-x-4">
          <Link to="/">Home</Link>
          <Link to='/learn'>Learn</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <LogoutButton />
            </>
          )}
          {!isAuthenticated && (
            <>
            <LoginButton />
            <SignUpButton />
            </>
          )}
        </ul>
      </div>

      <div className='md:hidden mr-5'> 
        <Sheet>
          <SheetTrigger>
            <Button variant="outline">
              <AlignJustify className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div>
              <h1>Sidebar</h1>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

