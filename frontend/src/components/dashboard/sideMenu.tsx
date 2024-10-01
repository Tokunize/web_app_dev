import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from '../buttons/loginButton';
import { LogoutButton } from '../buttons/logoutBtn';
import { useState } from 'react';
import { useUser } from '@/context/userProvider';

interface MenuItem {
  name: string;
  link?: string;
  icon: string;
}

interface SideMenuProps {
  data: MenuItem[];
  onMenuClick: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ data, onMenuClick }) => {
  const { isAuthenticated } = useAuth0();
  const { name, userImage } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null | undefined>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <aside className="absolute md:static w-full md:w-auto h-[50px] md:h-auto">
      <div className="md:hidden p-4 flex justify-between items-center border-b">
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
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between`}
      >
        <ul className="space-y-2 sticky top-0">
          {data.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link || '#'}
                className={`w-full text-left hover:bg-gray-100 p-2 rounded block flex items-center ${
                  selectedItem === item.link ? 'bg-gray-200' : ''
                }`} // Aplicar el color de fondo al elemento seleccionado
                onClick={() => {
                  setSelectedItem(item.link); // Actualizar el estado del elemento seleccionado
                  onMenuClick();
                  setMenuOpen(false);
                }}
              >
                {item.icon} 
                <span className="ml-2">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mb-[10px] flex flex-col justify-between">
          {isAuthenticated && (
            <div className="flex items-center space-x-1 mb-3">
              {userImage && (
                <img
                  src={userImage}
                  className="w-8 h-8 rounded-full"
                  alt={name || 'User profile'}
                />
              )}
              <span className="font-bold text-sm">{name}</span>
            </div>
          )}
          <span>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </span>
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </aside>
  );
};

export default SideMenu;
