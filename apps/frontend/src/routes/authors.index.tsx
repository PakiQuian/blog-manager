import { Avatar } from "@heroui/react";

import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuthors } from "../lib/public";

export const Route = createFileRoute("/authors/")({
  component: AuthorsPage,
});

function AuthorsPage() {
  const authors = useAuthors();

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-[60ch]">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
          Autores
        </h1>
        <p className="text-foreground/60 leading-relaxed">
          Quiénes están publicando y cuántos artículos escribió cada uno.
        </p>
      </header>

      {authors.isLoading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-medium border border-divider p-4 animate-pulse"
            >
              <div className="size-10 rounded-full bg-content2 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3.5 w-2/3 rounded bg-content2" />
                <div className="h-3 w-1/3 rounded bg-content2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {authors.isError && <p className="text-danger">No pudimos cargar los autores.</p>}

      {authors.data && authors.data.length === 0 && (
        <p className="text-foreground/60">Todavía no hay autores con artículos publicados.</p>
      )}

      {authors.data && authors.data.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {authors.data.map((author) => (
            <Link
              key={author.userId}
              to="/authors/$id"
              params={{ id: author.userId }}
              className="flex items-center gap-3 rounded-medium border border-divider bg-content1 hover:bg-content2 transition-colors p-4"
            >
              <Avatar name={author.name} className="shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{author.name}</p>
                <p className="text-sm text-foreground/60">
                  {author.articleCount} artículo{author.articleCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
