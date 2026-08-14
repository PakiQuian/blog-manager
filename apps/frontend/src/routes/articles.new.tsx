import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArticleForm } from "../components/ArticleForm";
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Nuevo artículo</h1>
      <ArticleForm
        defaultValues={{ title: "", content: "", coverImageUrl: "" }}
        submitLabel="Crear artículo"
        onSubmit={async (value) => {
          await createArticle.mutateAsync(value);
          await navigate({ to: "/articles" });
        }}
      />
    </div>
  );
}
