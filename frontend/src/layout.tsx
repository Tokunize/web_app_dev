
import { Marketplace } from "./views/marketplace";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "./views/singleProperty";
import { SignUpPage } from "./views/signUpPage";
import { UserProvider } from "./context/userProvider";
import ProtectedRoute from "./protectedRoutes";
import CreatePropertyController from "./components/dashboard/createPropertyController";
import DashboardLayout from "./dashboardLayout";
import MainLayout from "./mainLayout"; 
import { GeneralDashboard } from "./components/dashboard/generalDashboard";
import { Porfolio } from "./components/dashboard/porfolio";
import { Investment } from "./components/dashboard/investment";
import { Transaction } from "./components/dashboard/transactions";
import { Blog } from "./views/blog";
import { SingleArticleView } from "./views/singleArticleView";
import { Toaster } from "./components/ui/toaster";
import { InvestorOverview } from "./components/dashboard/investorOverview";

const Layout = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/*Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Marketplace />} />
            <Route path="property-details/:id/" element={<SingleProperty />} />
            <Route path="sign-up/" element={<SignUpPage />} />
            <Route path="blog/" element={<Blog/>} />
            <Route path="blog/article/:id/" element={<SingleArticleView/>} />
          </Route>

          {/*Dshboard with the sidemenu */}
          <Route element={<DashboardLayout />}>
            <Route
              path="porfolio/"
              element={
                <ProtectedRoute roleRequired="owner,admin" element={<Porfolio />} />
              }
            />
            <Route
              path="transactions/"
              element={
                <ProtectedRoute roleRequired="investor" element={<Transaction/>} />
              }
            />
             <Route
              path="investments/"
              element={
                <ProtectedRoute roleRequired="investor" element={<Investment/>} />
              }
            />
            <Route
              path="investor-dashboard/"
              element={
                <ProtectedRoute roleRequired="investor" element={<InvestorOverview />} />
              }
            />
            <Route
              path="overview/"
              element={
                <ProtectedRoute roleRequired="owner,admin,investor" element={<GeneralDashboard />} />
              }
            />
            {/* <Route
              path="investment-dashboard"
              element={
                <ProtectedRoute roleRequired="investor" element={<InvestorDashboard />} />
              }
            /> */}
            <Route
              path="dashboard-property/:propertyId"
              element={
                <ProtectedRoute roleRequired="investor,admin" element={<CreatePropertyController />} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default Layout;
