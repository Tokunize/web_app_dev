import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from '../buttons/loginButton';
import { LogoutButton } from '../buttons/logoutBtn';
import { Button } from '../ui/button';
import { useState } from 'react';

interface MenuItem {
  name: string;
  link?: string;
}

interface SideMenuProps {
  data: MenuItem[];
  onMenuClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ data, onMenuClick }) => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);  // State to track menu visibility

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="absolute md:static w-full md:w-auto h-[50px] md:h-auto">
      {/* Button for mobile menu */}
      <div className="md:hidden  p-4 flex justify-between items-center border-b">
        <div onClick={() => navigate("/")}>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <button onClick={toggleMenu} className="text-2xl">
          {menuOpen ? (
            <span>&#x2715;</span>
          ) : (
            <span>&#9776;</span>
          )}
        </button>
      </div>

      <div
        className={`fixed md:static md:flex z-50 top-0 left-0 h-full w-52 bg-white p-5 border-r shadow-md transform ${
          menuOpen ? "translate-x-0 " : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <ul className="space-y-2 sticky top-0">
          {data.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link || '#'}
                className="w-full text-left hover:bg-gray-100 p-2 rounded block"
                onClick={() => {
                  onMenuClick();
                  setMenuOpen(false); 
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <Button className="w-full" onClick={() => {
              navigate("/");
              setMenuOpen(false); 
            }}>Marketplace</Button>
          </li>
          <li>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default SideMenu;