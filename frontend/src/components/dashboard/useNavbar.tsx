import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notifications } from '../notifications';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"; // Asegúrate de que esta importación sea correcta
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { CreateWallet } from './createWallet';
import { LogoutButton } from '../buttons/logoutBtn'; // Ajusta según sea necesario
import { useUser } from '@/context/userProvider';


const AccountMenu: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    return (
        <div className="flex flex-col">
            <div className="p-4 font-bold">My Account</div>
            <div className="border-b"></div>
            <div className="flex flex-col">
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/account-settings")}>Account Settings</MenuItem>
                <MenuItem onClick={() => navigate("/")}>Marketplace</MenuItem>
                <MenuItem onClick={() => <CreateWallet />}>Create Wallet</MenuItem>
                <MenuItem onClick={() => <LogoutButton />}>Logout</MenuItem>
            </div>
        </div>
    );
};

const MenuItem: React.FC<{
    onClick: () => void;
    children: React.ReactNode; 
}> = ({ onClick, children }) => {
    return (
        <button className="text-left py-2 px-4 hover:bg-gray-200" onClick={onClick}>
            {children}
        </button>
    );
};

export const UserNavbar: React.FC = () => {
    const navigate = useNavigate();
    const { userImage } = useUser();

    return (
        <div className="flex mb-4 ">
            <div className="relative flex items-center justify-center mr-4">
                <Notifications />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer w-10 h-10 rounded-full">
                        <AvatarImage src={userImage || undefined} alt="@shadcn" />
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