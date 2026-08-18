import { Input, Pagination, Skeleton } from "@heroui/react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useArticleSearch } from "../lib/public";
import { useDebouncedValue } from "../lib/use-debounced-value";

const searchSchema = z.object({
  q: z.string().catch(""),
  page: z.coerce.number().int().min(1).catch(1),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
});

function SearchPage() {
  const { q: initialQ, page } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const reduceMotion = useReducedMotion();

  const [inputValue, setInputValue] = useState(initialQ);
  const debouncedQuery = useDebouncedValue(inputValue, 300);
  const search = useArticleSearch(debouncedQuery, page);
  const hasQuery = debouncedQuery.trim().length > 0;

  useEffect(() => {
    navigate({ search: { q: debouncedQuery || undefined, page: undefined }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-[60ch]">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
          Buscar artículos
        </h1>
        <p className="text-foreground/60 leading-relaxed">
          Encontrá artículos por título, contenido o nombre del autor.
        </p>
      </header>

      <Input
        placeholder="Título, contenido o autor..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-md"
        aria-label="Buscar artículos"
        autoFocus
      />

      {!hasQuery && <p className="text-foreground/60">Escribí algo para empezar a buscar.</p>}

      {hasQuery && search.isLoading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-medium border border-divider overflow-hidden">
              <Skeleton className="aspect-video" />
              <div className="p-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasQuery && search.isError && (
        <p className="text-danger">Ocurrió un error al buscar. Probá de nuevo en un momento.</p>
      )}

      {hasQuery && search.data && search.data.items.length === 0 && (
        <p className="text-foreground/60">No encontramos artículos para "{debouncedQuery}".</p>
      )}

      {hasQuery && search.data && search.data.items.length > 0 && (
        <motion.div
          {...reveal}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {search.data.items.map((item) => (
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
                  {item.authorName} · {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground/80 line-clamp-2">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      {hasQuery && search.data && search.data.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={search.data.totalPages}
            page={page}
            color="primary"
            onChange={(newPage) => navigate({ search: { q: debouncedQuery, page: newPage } })}
          />
        </div>
      )}
    </div>
  );
}
