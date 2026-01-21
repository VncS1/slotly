import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 bg-gray-100 text-sm">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <hr />
      {/* O Outlet é onde as páginas filhas serão renderizadas */}
      <Outlet />

      {/* Ferramenta de debug (só aparece em dev) */}
      <TanStackRouterDevtools />
    </>
  ),
})