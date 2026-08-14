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
      throw redirect({ to: "/articles" });
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
      await navigate({ to: "/articles" });
    },
  });

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>
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
      <p className="text-sm mt-4 text-neutral-500">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
