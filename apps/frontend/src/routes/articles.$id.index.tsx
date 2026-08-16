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

export const Route = createFileRoute("/articles/$id/")({
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useArticle(id);
  const deleteArticle = useDeleteArticle();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-pulse">
        <div className="aspect-video w-full rounded-large bg-content2" />
        <div className="flex flex-col gap-2">
          <div className="h-9 w-3/4 rounded bg-content2" />
          <div className="h-4 w-40 rounded bg-content2" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full rounded bg-content2" />
          <div className="h-4 w-full rounded bg-content2" />
          <div className="h-4 w-2/3 rounded bg-content2" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-danger">No pudimos encontrar ese artículo.</p>
        <Link to="/search" className="text-primary text-sm font-medium w-fit">
          Volver a buscar
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto">
      {article.coverImageUrl && (
        <img
          src={article.coverImageUrl}
          alt=""
          className="w-full rounded-large mb-6 object-cover max-h-96"
        />
      )}
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
        {article.title}
      </h1>
      <p className="text-sm text-foreground/60 mb-6">
        {article.authorId ? (
          <Link
            to="/authors/$id"
            params={{ id: article.authorId }}
            className="hover:text-primary transition-colors font-medium"
          >
            {article.authorName}
          </Link>
        ) : (
          article.authorName
        )}{" "}
        · {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="whitespace-pre-wrap leading-relaxed text-foreground">{article.content}</div>

      {article.isOwner && (
        <div className="flex gap-2 mt-8">
          <Link
            to="/articles/$id/edit"
            params={{ id }}
            className={buttonStyles({ variant: "bordered" })}
          >
            Editar
          </Link>
          <Button color="danger" variant="light" onPress={onOpen}>
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
                    await navigate({ to: "/profile" });
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
