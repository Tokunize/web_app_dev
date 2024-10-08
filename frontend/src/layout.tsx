
import { Marketplace } from "./views/marketplace";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "./views/singleProperty";
import { UserProvider } from "./context/userProvider";
import ProtectedRoute from "./protectedRoutes";
import CreatePropertyController from "./components/dashboard/createPropertyController";
import DashboardLayout from "./dashboardLayout";
import MainLayout from "./mainLayout"; 
import { Porfolio } from "./components/dashboard/porfolio";
import { Assests } from "./components/dashboard/assets";
import { Transaction } from "./components/dashboard/transactions";
import { Blog } from "./views/blog";
import { SingleArticleView } from "./views/singleArticleView";
import { Toaster } from "./components/ui/toaster";
import { PublicPropertyPage } from "./views/publicProperty";
import Dashboard from "./dashboard";
import SignUpController from "./components/singUpFlow.tsx/singUpController";
import { PropertyManagement } from "./components/dashboard/propertyManagment";

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
            <Route path="blog/" element={<Blog/>} />
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
