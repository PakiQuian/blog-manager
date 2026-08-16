import { Button } from "@heroui/react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PublicHome,
});

function PublicHome() {
  return (
    <div className="flex flex-col gap-16">
      <header className="max-w-[60ch]">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
          Leé lo que se está escribiendo
        </h1>
        <p className="text-foreground/60 leading-relaxed">
          Buscá artículos por título, contenido o autor, o explorá quién está publicando.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        <div className="rounded-medium border border-primary/30 bg-primary/5 p-6 flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Buscar artículos</h2>
          <p className="text-sm text-foreground/60 flex-1">
            Por título, contenido o nombre del autor.
          </p>
          <Button as={Link} to="/search" color="primary" className="w-fit">
            Buscar
          </Button>
        </div>

        <div className="rounded-medium border border-divider p-6 flex flex-col gap-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Autores</h2>
          <p className="text-sm text-foreground/60 flex-1">
            Quiénes están publicando y cuántos artículos escribió cada uno.
          </p>
          <Button as={Link} to="/authors" variant="bordered" className="w-fit">
            Ver autores
          </Button>
        </div>
      </div>
    </div>
  );
}
