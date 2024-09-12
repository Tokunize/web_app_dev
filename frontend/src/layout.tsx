import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "./views/singleProperty";
import { Toaster } from "./components/ui/toaster";
import { SignUpPage } from "./views/signUpPage";
import { OwnerDashboard } from "./views/ownerDashboard";
import { InvestorDashboard } from "./views/investorDashboard";
import { UserProvider } from "./context/userProvider";
import ProtectedRoute from "./protectedRoutes";
import { DashboardProperty } from "./views/dashboardProperty";
import { PaymentPage } from "./views/paymentPage";

const Layout = () => {
  return (
    <UserProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="property-details/:id" element={<SingleProperty />} />
          <Route path="sign-up" element={<SignUpPage />} />
          
          <Route
            path="dashboard"
            element={
              <ProtectedRoute roleRequired="owner,admin" element={<OwnerDashboard />} />
            }
          />
          <Route
            path="investment-dashboard"
            element={
              <ProtectedRoute roleRequired="investor" element={<InvestorDashboard />} />
            }
          />
          <Route
            path="dashboard-property/:propertyId"
            element={
              <ProtectedRoute roleRequired="investor,admin" element={<DashboardProperty />} />
            }
          />
          <Route
            path="investment/:propertyId/"
            element={
              <ProtectedRoute roleRequired="investor" element={<PaymentPage />} />
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default Layout;
