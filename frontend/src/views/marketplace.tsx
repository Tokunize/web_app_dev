import { Herobanner } from "@/components/heroBanner";
import { PropertyList } from "@/components/propertyList";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";

import { ToastDemo } from "@/components/toast";
export const Marketplace = () =>{
    return(
        <section className="px-[50px]">
            <ToastProvider>
            <Toaster/>

            <Herobanner/>
            <ToastDemo/>
            <PropertyList/>

            </ToastProvider>
        </section>
    )
}