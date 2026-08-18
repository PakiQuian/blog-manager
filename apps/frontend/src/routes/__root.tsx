import {
  Button,
  HeroUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { queryClient } from "../lib/query-client";
import { useSession, signOut } from "../lib/auth-client";

const activeLinkProps = {
  className: "text-primary font-medium",
};

function RootLayout() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    setIsMenuOpen(false);
    await signOut();
    queryClient.clear();
    await navigate({ to: "/" });
  }

  const publicLinks = [
    <Link
      key="search"
      to="/search"
      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
      activeProps={activeLinkProps}
      onClick={() => setIsMenuOpen(false)}
    >
      Buscar
    </Link>,
    <Link
      key="authors"
      to="/authors"
      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
      activeProps={activeLinkProps}
      onClick={() => setIsMenuOpen(false)}
    >
      Autores
    </Link>,
  ];

  const authLinks = session
    ? [
        <Link
          key="profile"
          to="/profile"
          className="text-sm text-foreground/80 hover:text-foreground transition-colors"
          activeProps={activeLinkProps}
          onClick={() => setIsMenuOpen(false)}
        >
          Perfil
        </Link>,
        <Button key="sign-out" variant="bordered" onPress={handleSignOut}>
          Cerrar sesión
        </Button>,
      ]
    : [
        <Link
          key="login"
          to="/login"
          className="text-sm text-foreground/80 hover:text-foreground transition-colors"
          activeProps={activeLinkProps}
          onClick={() => setIsMenuOpen(false)}
        >
          Iniciar sesión
        </Link>,
        <Button
          key="register"
          as={Link}
          to="/register"
          color="primary"
          onPress={() => setIsMenuOpen(false)}
        >
          Registrarme
        </Button>,
      ];

  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-svh flex flex-col bg-background">
          <Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            className="border-b border-divider"
          >
            <NavbarContent justify="start">
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                className="sm:hidden cursor-pointer"
              />
              <NavbarBrand>
                <Link
                  to="/"
                  className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src="/blog.png" alt="" className="size-7" />
                  Blog Manager
                </Link>
              </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-6" justify="end">
              {[...publicLinks, ...authLinks].map((item) => (
                <NavbarItem key={item.key}>{item}</NavbarItem>
              ))}
            </NavbarContent>

            <NavbarMenu>
              {[...publicLinks, ...authLinks].map((item) => (
                <NavbarMenuItem key={item.key}>{item}</NavbarMenuItem>
              ))}
            </NavbarMenu>
          </Navbar>

          <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
