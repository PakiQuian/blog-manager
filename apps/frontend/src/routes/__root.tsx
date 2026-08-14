import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { queryClient } from "../lib/query-client";
import { useSession, signOut } from "../lib/auth-client";

function RootLayout() {
  const { data: session } = useSession();

  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-svh flex flex-col">
          <header className="border-b border-neutral-200 dark:border-neutral-800">
            <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
              <Link to="/" className="font-semibold text-lg">
                Blog Manager
              </Link>
              <div className="flex items-center gap-4 text-sm">
                {session ? (
                  <>
                    <Link to="/articles" className="hover:underline">
                      Mis artículos
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="hover:underline"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="hover:underline">
                      Iniciar sesión
                    </Link>
                    <Link to="/register" className="hover:underline">
                      Registrarme
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </header>
          <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
