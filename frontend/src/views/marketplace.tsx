import { Herobanner } from "@/components/heroBanner";
import { PropertyList } from "@/components/propertyList";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";

export const Marketplace = () => {
  return (
    <ToastProvider>
      <section className="px-[50px]">
        <Toaster /> {/* Toaster está bien aquí */}
        <Herobanner />
        <PropertyList />
      </section>
    </ToastProvider>
  );
};
