import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api";

export interface AuthorSummary {
  userId: string;
  name: string;
  email: string;
  articleCount: number;
}

export interface SearchResultItem {
  _id: string;
  title: string;
  coverImageUrl?: string | null;
  createdAt: string;
  authorName: string;
  excerpt: string;
}

export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: () => apiFetch<AuthorSummary[]>("/api/public/authors"),
  });
}

export function useArticleSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () => apiFetch<{ items: SearchResultItem[] }>(`/api/public/search?q=${encodeURIComponent(q)}`),
    enabled: q.trim().length > 0,
  });
}
