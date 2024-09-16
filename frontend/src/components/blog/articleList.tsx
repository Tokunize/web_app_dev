
import { AllArticlesCard } from "./allArticlesCard";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const ArticleList = () => {
    const navigate = useNavigate()

  return (
    <section className="bg-gray-100 rounded">
        <Button onClick={()=> navigate("/blog/")} className="m-6" >Go to the Blog</Button>
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AllArticlesCard
                imageSrc="https://via.placeholder.com/400"
                title="Artículo de Ejemplo"
                description="Este es un breve resumen del artículo. Aquí se proporciona una descripción que se truncará si es demasiado larga para caber en el contenedor."
                link="/blog/article/1"
            />      
        </div>
    </section>
  );
};
