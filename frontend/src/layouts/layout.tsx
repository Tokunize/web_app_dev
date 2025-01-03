
import { Marketplace } from "../public/marketplace/marketplace";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "../public/marketplace/singleProperty";
import ProtectedRoute from "./protectedRoutes";
import DashboardLayout from "./dashboardLayout";
import MainLayout from "./mainLayout"; 
import { Assests } from "@/private/investor/assets/assets";
import { Transaction } from "@/private/investor/wallet/transactions";
import { Toaster } from "../components/ui/toaster";
import Dashboard from "./dashboard";
import SignUpController from "../components/singUpFlow.tsx/singUpController";
import { PropertyManagement } from "@/private/admin/propertyManagment";
import { TradingPage } from "../private/investor/trading/TradingPage";
// import { PublicPropertyForm } from "@/private/owner/publicPropertyForm";
import { SmartContractFunctions } from "@/private/smartContractsManagment/smartContractFuntions";
import VerifyEmailView from "@/public/login/verifyEmailView";
import ScrollToTop from "@/components/ScrollToTop";

const Layout = () => {
  return (
      <BrowserRouter>
        <Toaster />
        <ScrollToTop>
          <Routes>
            {/*Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Marketplace />} />
              <Route path="property/:reference_number/" element={<SingleProperty />} />
            </Route>

            <Route path="sign-up/" element={<SignUpController />} />
            <Route path="verify-email/" element={<VerifyEmailView />} />


            {/*Dshboard with the sidemenu */}
            <Route element={<DashboardLayout />}>
          
              <Route
                path="property-managment/"
                element={
                  <ProtectedRoute roleRequired="admin" element={<PropertyManagement />} />
                }
              />
              <Route
                path="transactions/"
                element={
                  <ProtectedRoute roleRequired="user" element={<Transaction/>} />
                }
              />
              <Route
                path="dashboard/"
                element={
                  <ProtectedRoute roleRequired="user,admin" element={<Dashboard/>} />
                }
              />
              <Route
                path="investments/"
                element={
                  <ProtectedRoute roleRequired="user" element={<Assests/>} />
                }
              />
              <Route
                path="trading/"
                element={
                  <ProtectedRoute roleRequired="user" element={<TradingPage/>} />
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
        </ScrollToTop>
      </BrowserRouter>
  );
};

export default Layout;
