import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { DataTable } from "@/components/dataTable/components/data-table";
import { OrdersTradingColumns } from "@/components/dataTable/components/columns/OrdersTradingColumns";
import { orderSchema } from "@/components/dataTable/data/schema";
import { z } from "zod";
import { orderStatus } from "@/components/dataTable/data/data";
import { useDispatch } from "react-redux";
import { setOfferType } from "../../../redux/tradingTypeSlice";
import { useEffect } from "react";


export const TraddingOfferGiven = () => {
  const dispatch = useDispatch();

  // Realiza la solicitud GET
  const { data, error, loading } = useGetAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/type/sell/`,
    true
  );

  useEffect(() => {
    dispatch(setOfferType("maded"));
  }, [dispatch]); // Esto asegura que la acción se despache solo una vez
  // Si está cargando, mostramos el spinner

  if (loading) {
    return <LoadingSpinner />;
  }

  // Si hubo un error al hacer la solicitud o no se recibieron datos, mostramos un mensaje de error
  if (error || !data) {
    return <div className="error-message">Error: {error ? error : 'No data received'}</div>;
  }

  // Si los datos son recibidos, parseamos de forma segura con Zod
  let parsedProperties;
  try {
    parsedProperties = z.array(orderSchema).parse(data); // Parseo de los datos con Zod
  } catch (err) {
    return <div className="error-message">Error al procesar los datos</div>; // Mensaje si el parseo falla
  }

  // Opciones de filtrado de la tabla
  const filterOptions = [
    { column: "orderStatus", title: "Order Status", options: orderStatus },
  ];

  // Cuando los datos se han recibido y parseado correctamente, renderizamos la tabla
  return (
    <section className="w-full grid grid-cols-1">
      <DataTable
        filterOptions={filterOptions}
        columns={OrdersTradingColumns}
        data={parsedProperties}
        
      />
    </section>
  );
};
