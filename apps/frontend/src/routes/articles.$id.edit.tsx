import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "../components/ArticleForm";
import { useArticle, useUpdateArticle } from "../lib/articles";

export const Route = createFileRoute("/articles/$id/edit")({
  component: EditArticlePage,
});

function EditArticlePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useArticle(id);
  const updateArticle = useUpdateArticle(id);

  if (isLoading) {
    return <p className="text-neutral-500">Cargando artículo...</p>;
  }

  if (isError || !article) {
    return <p className="text-danger">No se pudo cargar el artículo.</p>;
  }

  if (!article.isOwner) {
    return <p className="text-danger">No tenés permiso para editar este artículo.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Editar artículo</h1>
      <ArticleForm
        defaultValues={{
          title: article.title,
          content: article.content,
          coverImageUrl: article.coverImageUrl ?? "",
        }}
        submitLabel="Guardar cambios"
        onSubmit={async (value) => {
          await updateArticle.mutateAsync(value);
          await navigate({ to: "/articles" });
        }}
      />
    </div>
  );
}
