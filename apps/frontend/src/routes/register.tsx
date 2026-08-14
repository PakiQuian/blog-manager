import { Button, Input } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, signUp } from "../lib/auth-client";
import { fieldErrorMessage } from "../lib/form-error";
import { registerSchema } from "../schemas/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: "/articles" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });
      if (error) {
        setFormError(error.message ?? "No se pudo crear la cuenta");
        return;
      }
      await navigate({ to: "/articles" });
    },
  });

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Crear cuenta</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field name="name" validators={{ onChange: registerSchema.shape.name }}>
          {(field) => (
            <Input
              label="Nombre"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={fieldErrorMessage(field.state.meta.errors)}
            />
          )}
        </form.Field>

        <form.Field name="email" validators={{ onChange: registerSchema.shape.email }}>
          {(field) => (
            <Input
              label="Email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={fieldErrorMessage(field.state.meta.errors)}
            />
          )}
        </form.Field>

        <form.Field name="password" validators={{ onChange: registerSchema.shape.password }}>
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              description="Mínimo 8 caracteres"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={fieldErrorMessage(field.state.meta.errors)}
            />
          )}
        </form.Field>

        {formError && <p className="text-danger text-sm">{formError}</p>}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" color="primary" isLoading={isSubmitting}>
              Crear cuenta
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-sm mt-4 text-neutral-500">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
