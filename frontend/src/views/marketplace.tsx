import { Herobanner } from "@/components/heroBanner";
import { PropertyList } from "@/components/propertyList";

import { ToastDemo } from "@/components/toastDemo";
export const Marketplace = () =>{
    return(
        <section className="px-[50px]">
            <Herobanner/>
            <ToastDemo/>
            <PropertyList/>

        </section>
    )
}