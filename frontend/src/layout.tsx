
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "./views/singleProperty";
import { Toaster } from "./components/ui/toaster";
import { SignUpPage } from "./views/signUpPage";
import { UserProvider } from "./context/userProvider";
import ProtectedRoute from "./protectedRoutes";
import CreatePropertyController from "./components/dashboard/createPropertyController";
import { PaymentPage } from "./views/paymentPage";
import DashboardLayout from "./dashboardLayout";
import MainLayout from "./mainLayout"; 
import { GeneralDashboard } from "./components/dashboard/generalDashboard";
import { Porfolio } from "./components/dashboard/porfolio";
import { Investment } from "./components/dashboard/investment";
import { Transaction } from "./components/dashboard/transactions";
import { Blog } from "./views/blog";
import { ArticleList } from "./components/blog/articleList";
import CreateArticle from "./components/blog/createarticle";
import { SingleArticleView } from "./views/singleArticleView";

const Layout = () => {
  return (
    <UserProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/*Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<App />} />
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
              path="overview/"
              element={
                <ProtectedRoute roleRequired="owner,admin,investor,blog-admin" element={<GeneralDashboard />} />
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
            <Route
              path="investment/:property_id"
              element={
                <ProtectedRoute roleRequired="investor" element={<PaymentPage />} />
              }
            />

            {/* ROUTES FOR THE BLOG ADMIN */}
            <Route
              path="articles-list/"
              element={
                <ProtectedRoute roleRequired="blog-admin" element={<ArticleList />} />
              }
            />
            <Route
              path="create-article/"
              element={
                <ProtectedRoute roleRequired="blog-admin" element={<CreateArticle />} />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default Layout;
