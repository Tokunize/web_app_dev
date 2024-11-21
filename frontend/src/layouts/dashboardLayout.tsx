
import { Outlet } from "react-router-dom";
import SideMenu from "@/components/dashboard/sideMenu";
import { UserNavbar } from "@/components/dashboard/useNavbar";
import {ChartCandlestick} from "lucide-react"
import {WalletMinimal, Coins,Grid2x2} from "lucide-react"
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";


const DashboardLayout = () => {
  const { role } = useSelector((state: RootState) => state.user);

  const menuData = role === 'admin' ? [
    { name: 'Overview', link: '/dashboard/',  icon:<Grid2x2 /> },
    { name: 'Property Management', link: '/property-managment/',icon:<Grid2x2 /> },
  ] : role === 'owner' ? [
    { name: 'Overview', link: '/dashboard/',  icon:<Grid2x2 /> },
    { name: 'My Properties', link: '/porfolio/',  icon:<Coins /> },
  ] : role === 'investor' ? [
    { name: 'Overview', link: '/dashboard/', icon:<Grid2x2 /> },
    { name: 'Assets', link: '/investments/', icon:<Coins />},
    { name: 'Wallet', link: '/transactions/', icon: <WalletMinimal /> },
    { name: 'Trade', link: '/trading/', icon: <ChartCandlestick />},

  ]  : [];

  return (
    <div className="flex min-h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="flex-grow p-5 mt-[64px] md:mt-[0px]">
        <div className="flex justify-end mb-5 px-[20px]">
          <UserNavbar/>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
