import { useQuery } from "@tanstack/react-query";
import { ApiError, apiFetch } from "./api";

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

export interface PaginatedSearchResults {
  items: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useArticleSearch(q: string, page: number) {
  return useQuery({
    queryKey: ["search", q, page],
    queryFn: () =>
      apiFetch<PaginatedSearchResults>(
        `/api/public/search?q=${encodeURIComponent(q)}&page=${page}`,
      ),
    enabled: q.trim().length > 0,
  });
}

export interface AuthorArticle {
  _id: string;
  title: string;
  coverImageUrl?: string | null;
  createdAt: string;
  excerpt: string;
}

export interface AuthorDetail {
  userId: string;
  name: string;
  email: string;
  articleCount: number;
  articles: AuthorArticle[];
}

export function useAuthorDetail(userId: string) {
  return useQuery({
    queryKey: ["author", userId],
    queryFn: () => apiFetch<AuthorDetail>(`/api/public/authors/${userId}`),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 1;
    },
  });
}
