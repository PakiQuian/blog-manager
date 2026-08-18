import { Link } from "@tanstack/react-router";

interface BreadcrumbItem {
  label: string;
  to?: "/authors" | "/authors/$id" | "/profile" | "/articles/$id";
  params?: { id: string };
  isLoading?: boolean;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-foreground/60">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span className="text-foreground/30" aria-hidden="true">
                  /
                </span>
              )}
              {item.isLoading ? (
                <span className="h-4 w-20 rounded bg-content2 animate-pulse inline-block" />
              ) : isLast || !item.to ? (
                <span className="text-foreground/80 truncate max-w-[200px]" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  params={item.params}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                  title={item.label}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
