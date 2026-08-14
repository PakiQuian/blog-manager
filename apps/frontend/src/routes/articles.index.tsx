import {
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
import { useDeleteArticle, useOwnArticles } from "../lib/articles";
import { requireSession } from "../lib/route-guards";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
});

export const Route = createFileRoute("/articles/")({
  validateSearch: searchSchema,
  beforeLoad: requireSession,
  component: ArticlesListPage,
});

function ArticlesListPage() {
  const { page } = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useOwnArticles(page);
  const deleteArticle = useDeleteArticle();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function askDelete(id: string) {
    setPendingDeleteId(id);
    onOpen();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mis artículos</h1>
        <Button as={Link} to="/articles/new" color="primary">
          Nuevo artículo
        </Button>
      </div>

      {isLoading && <p className="text-neutral-500">Cargando artículos...</p>}

      {isError && (
        <p className="text-danger">No se pudieron cargar tus artículos. Probá de nuevo más tarde.</p>
      )}

      {data && data.items.length === 0 && (
        <p className="text-neutral-500">Todavía no creaste ningún artículo.</p>
      )}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.items.map((article) => (
            <div
              key={article._id}
              className="border border-neutral-200 dark:border-neutral-800 rounded-medium p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="min-w-0">
                <h2 className="font-medium break-words">{article.title}</h2>
                <p className="text-sm text-neutral-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to="/articles/$id/edit"
                  params={{ id: article._id }}
                  className={buttonStyles({ size: "sm", variant: "flat" })}
                >
                  Editar
                </Link>
                <Button size="sm" color="danger" variant="flat" onPress={() => askDelete(article._id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={data.totalPages}
            page={page}
            onChange={(newPage) => navigate({ to: "/articles", search: { page: newPage } })}
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
