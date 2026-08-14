import { Input } from "@heroui/react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useArticleSearch, useAuthors } from "../lib/public";
import { useDebouncedValue } from "../lib/use-debounced-value";

const searchSchema = z.object({
  q: z.string().catch(""),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  component: PublicHome,
});

function PublicHome() {
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const authors = useAuthors();

  const [inputValue, setInputValue] = useState(initialQ);
  const debouncedQuery = useDebouncedValue(inputValue, 300);
  const search = useArticleSearch(debouncedQuery);

  useEffect(() => {
    navigate({ search: { q: debouncedQuery || undefined }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Autores</h1>
        {authors.isLoading && <p className="text-neutral-500">Cargando autores...</p>}
        {authors.isError && <p className="text-danger">No se pudieron cargar los autores.</p>}
        {authors.data && authors.data.length === 0 && (
          <p className="text-neutral-500">Todavía no hay autores con artículos publicados.</p>
        )}
        {authors.data && authors.data.length > 0 && (
          <ul className="flex flex-col gap-2">
            {authors.data.map((author) => (
              <li
                key={author.userId}
                className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 py-2"
              >
                <span>{author.name}</span>
                <span className="text-neutral-500">
                  {author.articleCount} artículo{author.articleCount === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h1 className="text-2xl font-semibold mb-4">Buscar artículos</h1>
        <Input
          placeholder="Buscar por título, contenido o autor..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-md mb-6"
        />

        {debouncedQuery.trim().length === 0 && (
          <p className="text-neutral-500">Escribí algo para buscar artículos.</p>
        )}

        {debouncedQuery.trim().length > 0 && search.isLoading && (
          <p className="text-neutral-500">Buscando...</p>
        )}

        {debouncedQuery.trim().length > 0 && search.isError && (
          <p className="text-danger">Ocurrió un error al buscar.</p>
        )}

        {search.data && debouncedQuery.trim().length > 0 && search.data.items.length === 0 && (
          <p className="text-neutral-500">No se encontraron artículos.</p>
        )}

        {search.data && search.data.items.length > 0 && (
          <div className="flex flex-col gap-4">
            {search.data.items.map((item) => (
              <Link
                key={item._id}
                to="/articles/$id"
                params={{ id: item._id }}
                className="border border-neutral-200 dark:border-neutral-800 rounded-medium p-4 block hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <h2 className="font-medium">{item.title}</h2>
                <p className="text-sm text-neutral-500 mb-1">
                  {item.authorName} · {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
