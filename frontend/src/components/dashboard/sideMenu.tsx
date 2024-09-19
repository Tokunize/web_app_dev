import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../buttons/logoutBtn";
import { LoginButton } from "../buttons/loginButton";
import { Button } from '../ui/button';

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
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-52 bg-white p-5 border-r shadow-md">
      <ul className="space-y-2 sticky top-0">
        {data.map((item, index) => (
          <li key={index}>
            <Link 
              to={item.link || '#'} 
              className="w-full text-left hover:bg-gray-100 p-2 rounded block"
              onClick={onMenuClick} 
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li><Button className="w-full" onClick={()=> navigate("/")} >Marketplace</Button></li>
        <li>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</li>
      </ul>
    </div>
  );
};

export default SideMenu;
