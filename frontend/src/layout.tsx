import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SingleProperty } from "./views/singleProperty";
import { Toaster } from "./components/ui/toaster";

const Layout = () =>{
    return(
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route element={<App/>} path="/"/>
                    <Route element={<SingleProperty />} path="property-details/:id" />
                </Routes>
            </BrowserRouter>  
        </>
    )
}

export default Layout;