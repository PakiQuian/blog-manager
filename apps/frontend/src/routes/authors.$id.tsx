import { Avatar } from "@heroui/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ApiError } from "../lib/api";
import { useAuthorDetail } from "../lib/public";

export const Route = createFileRoute("/authors/$id")({
  component: AuthorDetailPage,
});

function AuthorDetailPage() {
  const { id } = Route.useParams();
  const author = useAuthorDetail(id);

  if (author.isError) {
    const notFound = author.error instanceof ApiError && author.error.status === 404;
    return (
      <div className="flex flex-col gap-3">
        <p className="text-danger">
          {notFound ? "No encontramos ese autor." : "Ocurrió un error al cargar el autor."}
        </p>
        <Link to="/authors" className="text-primary text-sm font-medium w-fit">
          Volver a autores
        </Link>
      </div>
    );
  }

  if (!author.data) {
    return (
      <div className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "Autores", to: "/authors" }, { label: "", isLoading: true }]} />
        <div className="flex items-center gap-4 animate-pulse">
          <div className="size-16 rounded-full bg-content2 shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 rounded bg-content2" />
            <div className="h-3.5 w-24 rounded bg-content2" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-medium border border-divider overflow-hidden animate-pulse">
              <div className="aspect-video bg-content2" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-content2" />
                <div className="h-3 w-1/2 rounded bg-content2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const data = author.data;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs items={[{ label: "Autores", to: "/authors" }, { label: data.name }]} />
      <header className="flex items-center gap-4">
        <Avatar name={data.name} className="shrink-0 w-16 h-16 text-large" />
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {data.name}
          </h1>
          <p className="text-foreground/60 text-sm">
            {data.articleCount} artículo{data.articleCount === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      {data.articles.length === 0 && (
        <p className="text-foreground/60">Este autor todavía no publicó artículos.</p>
      )}

      {data.articles.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.articles.map((item) => (
            <Link
              key={item._id}
              to="/articles/$id"
              params={{ id: item._id }}
              className="group rounded-medium border border-divider bg-content1 hover:bg-content2 transition-colors overflow-hidden flex flex-col"
            >
              {item.coverImageUrl ? (
                <img src={item.coverImageUrl} alt="" className="aspect-video w-full object-cover" />
              ) : (
                <div className="aspect-video w-full bg-content2 flex items-center justify-center">
                  <span className="font-display text-3xl text-foreground/30">
                    {item.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="p-4 flex flex-col gap-1.5">
                <h3 className="font-display font-semibold text-foreground leading-snug">{item.title}</h3>
                <p className="text-sm text-foreground/60">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground/80 line-clamp-2">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
