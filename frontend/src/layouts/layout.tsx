
import { Marketplace } from "../public/marketplace";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "../public/singleProperty";
import ProtectedRoute from "./protectedRoutes";
import CreatePropertyController from "@/private/owner/createPropertyController";
import DashboardLayout from "./dashboardLayout";
import MainLayout from "./mainLayout"; 
import { Porfolio } from "@/private/owner/porfolio";
import { Assests } from "@/private/investor/assets/assets";
import { Transaction } from "@/private/investor/wallet/transactions";
import { SingleArticleView } from "../public/singleArticleView";
import { Toaster } from "../components/ui/toaster";
import { PublicPropertyPage } from "../private/owner/publicProperty";
import Dashboard from "./dashboard";
import SignUpController from "../components/singUpFlow.tsx/singUpController";
import { PropertyManagement } from "@/private/admin/propertyManagment";
import { TradingPage } from "../private/investor/trading/TradingPage";
// import { PublicPropertyForm } from "@/private/owner/publicPropertyForm";
import { SmartContractFunctions } from "@/private/smartContractsManagment/smartContractFuntions";

const Layout = () => {
  return (
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/*Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Marketplace />} />
            <Route path="property-details/:id/" element={<SingleProperty />} />
            <Route path="blog/article/:id/" element={<SingleArticleView/>} />
          </Route>

          
          <Route path="sign-up/" element={<SignUpController />} />
          <Route path="public-property/" element={<PublicPropertyPage/>} />

          {/*Dshboard with the sidemenu */}
          <Route element={<DashboardLayout />}>
            <Route
              path="porfolio/"
              element={
                <ProtectedRoute roleRequired="owner" element={<Porfolio />} />
              }
            />
             <Route
              path="property-managment/"
              element={
                <ProtectedRoute roleRequired="admin" element={<PropertyManagement />} />
              }
            />
            <Route
              path="transactions/"
              element={
                <ProtectedRoute roleRequired="investor" element={<Transaction/>} />
              }
            />
            <Route
              path="dashboard/"
              element={
                <ProtectedRoute roleRequired="investor,admin,owner" element={<Dashboard/>} />
              }
            />
             <Route
              path="investments/"
              element={
                <ProtectedRoute roleRequired="investor" element={<Assests/>} />
              }
            />
            <Route
              path="trading/"
              element={
                <ProtectedRoute roleRequired="investor" element={<TradingPage/>} />
              }
            />
            <Route
              path="dashboard-property/:propertyId/"
              element={
                <ProtectedRoute roleRequired="admin" element={<CreatePropertyController />} />
              }
            />
            <Route
              path="property/smart-contract/:referenceNumber/"
              element={
                <ProtectedRoute roleRequired="admin" element={<SmartContractFunctions />} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default Layout;
