

import { useUser } from '@/context/userProvider';
import { useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

// Tipado del contexto de usuario
interface UserContext {
  userImage?: string;
  name: string;
  userEmail: string;
}

// Componente de navegación de usuario
export const UserNavbar: React.FC = () => {
  const { userImage, name, userEmail } = useUser() as UserContext;

  // Función de manejo de atajos de teclado
  const handleShortcuts = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      window.location.href = "/dashboard/";
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      window.location.href = "/";
    }
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      window.location.href = "/logout";
    }
  };


  useEffect(() => {
    // Agrega el evento al montar
    window.addEventListener("keydown", handleShortcuts);

    // Limpia el evento al desmontar
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  const userNavLinkDropDown = [
    {name: "Marketplace", url: "/", shortCutLetter: "Z"},
    {name: "Dashboard", url: "/dashboard/",shortCutLetter:"B" },
  ]

  return (
    <div className="flex space-x-4">
      <Notifications/>
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
            {userNavLinkDropDown.map((link, index)=>(
              <DropdownMenuItem key={index}>
              {link.name}
              <DropdownMenuShortcut>⌘{link.shortCutLetter}</DropdownMenuShortcut>
            </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
