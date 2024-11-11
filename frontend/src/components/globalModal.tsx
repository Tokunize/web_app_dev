import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface GlobalModalProps {
  id: string;
  title: string;
  description: string;
  contentComponent?: ReactNode;
}

export const GlobalModal: React.FC<GlobalModalProps> = ({
  id,
  title,
  description,
  contentComponent, // Nuevo prop para contenido dinámico
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          id={`trigger-${id}`}
          className="relative px-2 rounded-sm w-full flex cursor-default hover:bg-accent select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          {title}
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto" // Ajuste para scroll en el contenido
        id={`content-${id}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Renderiza el contenido dinámico si se proporciona */}
        <div className="overflow-y-auto h-auto">
          {contentComponent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
