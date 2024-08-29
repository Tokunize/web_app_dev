import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Layout = () =>{
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<App/>} path="/"/>
                </Routes>
            </BrowserRouter>  
        </div>
    )
}

export default Layout;