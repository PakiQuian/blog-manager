import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "../components/ArticleForm";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useCreateArticle } from "../lib/articles";
import { requireSession } from "../lib/route-guards";

export const Route = createFileRoute("/articles/new")({
  beforeLoad: requireSession,
  component: NewArticlePage,
});

function NewArticlePage() {
  const navigate = useNavigate();
  const createArticle = useCreateArticle();

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs items={[{ label: "Perfil", to: "/profile" }, { label: "Nuevo artículo" }]} />
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Nuevo artículo
        </h1>
        <p className="text-foreground/60 text-sm mt-1">
          Compartí algo nuevo. Podés editarlo cuando quieras después de publicarlo.
        </p>
      </header>
      <ArticleForm
        defaultValues={{ title: "", content: "", coverImageUrl: "" }}
        submitLabel="Crear artículo"
        onSubmit={async (value) => {
          await createArticle.mutateAsync(value);
          await navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
