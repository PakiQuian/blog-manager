import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useSession } from "../lib/auth-client";
import { useDeleteArticle, useOwnArticles } from "../lib/articles";
import { requireSession } from "../lib/route-guards";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
});

export const Route = createFileRoute("/profile")({
  validateSearch: searchSchema,
  beforeLoad: requireSession,
  component: ProfilePage,
});

function ProfilePage() {
  const { page } = Route.useSearch();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data, isLoading, isError } = useOwnArticles(page);
  const deleteArticle = useDeleteArticle();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function askDelete(id: string) {
    setPendingDeleteId(id);
    onOpen();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={session?.user.name} className="shrink-0 w-16 h-16 text-large" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {session?.user.name}
            </h1>
            <p className="text-foreground/60 text-sm">
              {data ? `${data.total} artículo${data.total === 1 ? "" : "s"}` : "Tus artículos"}
            </p>
          </div>
        </div>
        <Button as={Link} to="/articles/new" color="primary">
          Nuevo artículo
        </Button>
      </header>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-medium border border-divider p-4 animate-pulse">
              <div className="size-16 rounded-medium bg-content2 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-1/2 rounded bg-content2" />
                <div className="h-3 w-1/4 rounded bg-content2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-danger">No se pudieron cargar tus artículos. Probá de nuevo más tarde.</p>
      )}

      {data && data.items.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-medium border border-divider p-8">
          <p className="text-foreground/60">Todavía no creaste ningún artículo.</p>
          <Button as={Link} to="/articles/new" color="primary" size="sm">
            Crear el primero
          </Button>
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.items.map((article) => (
            <div
              key={article._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-medium border border-divider bg-content1 p-4"
            >
              {article.coverImageUrl ? (
                <img
                  src={article.coverImageUrl}
                  alt=""
                  className="size-16 rounded-medium object-cover shrink-0"
                />
              ) : (
                <div className="size-16 rounded-medium bg-content2 flex items-center justify-center shrink-0">
                  <span className="font-display text-xl text-foreground/30">
                    {article.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <Link
                  to="/articles/$id"
                  params={{ id: article._id }}
                  className="font-display font-semibold text-foreground hover:text-primary transition-colors break-words"
                >
                  {article.title}
                </Link>
                <p className="text-sm text-foreground/60">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  to="/articles/$id/edit"
                  params={{ id: article._id }}
                  className={buttonStyles({ size: "sm", variant: "bordered" })}
                >
                  Editar
                </Link>
                <Button size="sm" color="danger" variant="light" onPress={() => askDelete(article._id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={data.totalPages}
            page={page}
            color="primary"
            onChange={(newPage) => navigate({ to: "/profile", search: { page: newPage } })}
          />
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Eliminar artículo</ModalHeader>
              <ModalBody>
                <p>¿Seguro que querés eliminar este artículo? Esta acción no se puede deshacer.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteArticle.isPending}
                  onPress={async () => {
                    if (pendingDeleteId) {
                      await deleteArticle.mutateAsync(pendingDeleteId);
                    }
                    setPendingDeleteId(null);
                    onClose();
                  }}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
