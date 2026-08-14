import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./api";
import type { ArticleInput } from "../schemas/article";
import type { Article, PaginatedArticles } from "../types/article";

export function useOwnArticles(page: number, limit = 10) {
  return useQuery({
    queryKey: ["articles", "own", page, limit],
    queryFn: () => apiFetch<PaginatedArticles>(`/api/articles?page=${page}&limit=${limit}`),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => apiFetch<Article>(`/api/articles/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ArticleInput) =>
      apiFetch<Article>("/api/articles", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}

export function useUpdateArticle(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ArticleInput) =>
      apiFetch<Article>(`/api/articles/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ ok: true }>(`/api/articles/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });
}
