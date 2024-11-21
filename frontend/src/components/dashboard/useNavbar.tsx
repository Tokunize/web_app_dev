import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notifications } from '../notifications/notifications';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../buttons/logoutBtn';
import ConnectWallet from '../blockchain/connectWallet';
import { GlobalModal } from '../globalModal';

export const UserNavbar: React.FC = () => {
  const { userImage, name, userEmail } = useSelector((state: RootState) => state.user);
  const {address} = useSelector((state: RootState) => state.wallet)
  const navigate = useNavigate(); // Inicia el hook navigate

  // Función de manejo de atajos de teclado
  const handleShortcuts = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      navigate("/dashboard"); // Usar navigate para redirigir
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      navigate("/"); // Redirige al inicio
    }
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      navigate("/logout"); // Redirige a logout
    }
  };

  useEffect(() => {
    // Agrega el evento al montar
    window.addEventListener("keydown", handleShortcuts);

    // Limpia el evento al desmontar
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  const userNavLinkDropDown = [
    { name: "Marketplace", url: "/", shortCutLetter: "Z" },
    { name: "Dashboard", url: "/dashboard/", shortCutLetter: "B" },
  ];

  return (
    <div className="flex space-x-4">
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userImage || undefined} alt="@user" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {userNavLinkDropDown.map((link, index) => (
              <DropdownMenuItem key={index} onClick={() => navigate(link.url)}>
                {link.name}
                <DropdownMenuShortcut>⌘{link.shortCutLetter}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          
          {/* Asegúrate de que el modal se usa correctamente */}
          <GlobalModal
            title={address || "Connect Wallet"}
            id="1"
            description="Choose the wallet you want to connect"
            contentComponent={<ConnectWallet />}
          />

          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
