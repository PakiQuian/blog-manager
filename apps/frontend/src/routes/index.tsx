import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: PublicHome,
});

function PublicHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Página pública</h1>
      <p className="text-neutral-500">Autores, conteo de artículos y buscador — próximamente.</p>
    </div>
  );
}
