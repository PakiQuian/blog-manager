import { Button, Input } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, signIn } from "../lib/auth-client";
import { fieldErrorMessage } from "../lib/form-error";
import { loginSchema } from "../schemas/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: "/profile" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const { error } = await signIn.email({ email: value.email, password: value.password });
      if (error) {
        setFormError(error.message ?? "No se pudo iniciar sesión");
        return;
      }
      await navigate({ to: "/profile" });
    },
  });

  return (
    <div className="max-w-sm mx-auto mt-8 sm:mt-16 flex flex-col gap-8 sm:border sm:border-divider sm:rounded-large sm:p-8">
      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Iniciar sesión
        </h1>
        <p className="text-foreground/60 text-sm mt-1">Entrá para gestionar tus artículos.</p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field name="email" validators={{ onChange: loginSchema.shape.email }}>
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

        <form.Field name="password" validators={{ onChange: loginSchema.shape.password }}>
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
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
              Ingresar
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-sm text-foreground/60">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-primary font-medium">
          Registrate
        </Link>
      </p>
    </div>
  );
}
