import { Skeleton } from "@heroui/react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "../components/ArticleForm";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useArticle, useUpdateArticle } from "../lib/articles";
import { requireSession } from "../lib/route-guards";

export const Route = createFileRoute("/articles/$id/edit")({
  beforeLoad: requireSession,
  component: EditArticlePage,
});

function EditArticlePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useArticle(id);
  const updateArticle = useUpdateArticle(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: "Perfil", to: "/profile" },
            { label: "", isLoading: true },
            { label: "Editar" },
          ]}
        />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-14 rounded-medium" />
        <Skeleton className="h-40 rounded-medium" />
        <Skeleton className="h-14 rounded-medium" />
      </div>
    );
  }

  if (isError || !article || !article.isOwner) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-danger">
          {!article || isError
            ? "No se pudo cargar el artículo."
            : "No tenés permiso para editar este artículo."}
        </p>
        <Link to="/profile" className="text-primary text-sm font-medium w-fit">
          Volver a mi perfil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { label: "Perfil", to: "/profile" },
          { label: article.title, to: "/articles/$id", params: { id } },
          { label: "Editar" },
        ]}
      />
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Editar artículo
        </h1>
        <p className="text-foreground/60 text-sm mt-1">Los cambios se guardan al confirmar.</p>
      </header>
      <ArticleForm
        defaultValues={{
          title: article.title,
          content: article.content,
          coverImageUrl: article.coverImageUrl ?? "",
        }}
        submitLabel="Guardar cambios"
        onSubmit={async (value) => {
          await updateArticle.mutateAsync(value);
          await navigate({ to: "/profile" });
        }}
      />
    </div>
  );
}
