import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notifications } from '../notifications';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { CreateWallet } from './createWallet';
import { LogoutButton } from '../buttons/logoutBtn';
import { useUser } from '@/context/userProvider';

const AccountMenu: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    return (
        <div className="flex flex-col">
            <div className="p-4 font-bold">My Account</div>
            <div className="border-b"></div>
            <div className="flex flex-col px-3 mt-2">
                <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={() => navigate("/")}>Marketplace</MenuItem>
                <MenuItem onClick={() => <CreateWallet />}>Create Wallet</MenuItem>
                {/* Aquí renderizas el LogoutButton y defines que es el último */}
                <MenuItem isLastItem>
                    <LogoutButton />
                </MenuItem>
            </div>
        </div>
    );
};

const MenuItem: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
    isLastItem?: boolean; // Nueva prop para indicar si es el último item
}> = ({ onClick, children, isLastItem = false }) => {
    return (
        <button
            className={`text-left py-2  ${isLastItem ? 'pl-0' : 'hover:bg-accent duration-300 hover:text-accent-foreground pl-4'}  rounded-lg w-full`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const UserNavbar: React.FC = () => {
    const navigate = useNavigate();
    const { userImage } = useUser();

    return (
        <div className="flex">
            <div className="relative flex items-center justify-center mr-4">
                <Notifications />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer w-10 h-10 rounded-full">
                        <AvatarImage src={userImage || undefined} alt="@user" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="max-w-xs p-0">
                    <AccountMenu navigate={navigate} />
                </PopoverContent>
            </Popover>
        </div>
    );
};
