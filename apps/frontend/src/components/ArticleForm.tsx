import { Button, Input, Textarea } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ApiError } from "../lib/api";
import { fieldErrorMessage } from "../lib/form-error";
import { articleInputSchema, type ArticleInput } from "../schemas/article";

interface ArticleFormProps {
  defaultValues: ArticleInput;
  submitLabel: string;
  onSubmit: (value: ArticleInput) => Promise<void>;
}

export function ArticleForm({ defaultValues, submitLabel, onSubmit }: ArticleFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await onSubmit(value);
      } catch (err) {
        setFormError(err instanceof ApiError ? err.message : "Ocurrió un error inesperado");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <form.Field name="title" validators={{ onChange: articleInputSchema.shape.title }}>
        {(field) => (
          <Input
            label="Título"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={fieldErrorMessage(field.state.meta.errors)}
          />
        )}
      </form.Field>

      <form.Field name="content" validators={{ onChange: articleInputSchema.shape.content }}>
        {(field) => (
          <Textarea
            label="Contenido"
            minRows={10}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            isInvalid={field.state.meta.errors.length > 0}
            errorMessage={fieldErrorMessage(field.state.meta.errors)}
          />
        )}
      </form.Field>

      <form.Field name="coverImageUrl" validators={{ onChange: articleInputSchema.shape.coverImageUrl }}>
        {(field) => (
          <div className="flex flex-col gap-2">
            <Input
              label="URL de imagen de portada (opcional)"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={fieldErrorMessage(field.state.meta.errors)}
            />
            {field.state.value && field.state.meta.errors.length === 0 && (
              <img
                src={field.state.value}
                alt=""
                className="h-32 w-56 max-w-full rounded-medium border border-divider object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            )}
          </div>
        )}
      </form.Field>

      {formError && <p className="text-danger text-sm">{formError}</p>}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" color="primary" isLoading={isSubmitting} className="w-fit">
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
