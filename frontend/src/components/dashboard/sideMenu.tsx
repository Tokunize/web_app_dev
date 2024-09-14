import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../buttons/logoutBtn";
import { LoginButton } from "../buttons/loginButton";
import { Link } from "react-router-dom";

interface MenuItem {
  name: string;
  link?: string;
}

interface SideMenuProps {
  data: MenuItem[];
}

interface MenuItem {
  name: string;
  link?: string;
}

interface SideMenuProps {
  data: MenuItem[];
  onMenuClick: (itemName: string) => void; 
}

const SideMenu: React.FC<SideMenuProps> = ({ data, onMenuClick }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="h-full sidebar w-64 bg-white p-5 border-r shadow-md">
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index}>
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded"
              onClick={() => onMenuClick(item.name)} 
            >
              {item.name}
            </button>
          </li>
        ))}
        <li>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</li>
      </ul>
    </div>
  );
};

export default SideMenu;
