import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useArticle, useDeleteArticle } from "../lib/articles";

export const Route = createFileRoute("/articles/$id")({
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useArticle(id);
  const deleteArticle = useDeleteArticle();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isLoading) {
    return <p className="text-neutral-500">Cargando artículo...</p>;
  }

  if (isError || !article) {
    return <p className="text-danger">No se pudo encontrar el artículo.</p>;
  }

  return (
    <article className="max-w-2xl mx-auto">
      {article.coverImageUrl && (
        <img
          src={article.coverImageUrl}
          alt=""
          className="w-full rounded-medium mb-6 object-cover max-h-80"
        />
      )}
      <h1 className="text-3xl font-semibold mb-2">{article.title}</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {article.authorName} · {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="whitespace-pre-wrap">{article.content}</div>

      {article.isOwner && (
        <div className="flex gap-2 mt-8">
          <Link to="/articles/$id/edit" params={{ id }} className={buttonStyles({ variant: "flat" })}>
            Editar
          </Link>
          <Button color="danger" variant="flat" onPress={onOpen}>
            Eliminar
          </Button>
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
                    await deleteArticle.mutateAsync(id);
                    onClose();
                    await navigate({ to: "/articles" });
                  }}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </article>
  );
}
