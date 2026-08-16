export interface Article {
  _id: string;
  userId?: string;
  title: string;
  content: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  authorName?: string;
  authorId?: string;
  isOwner?: boolean;
}

export interface PaginatedArticles {
  items: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
