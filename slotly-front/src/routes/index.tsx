import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { api } from "../lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    if (context.auth.user?.role === "provider") {
      throw redirect({ to: "/event-types" });
    }
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("slotly_user");
  const user = userString ? JSON.parse(userString) : { name: "Usuário" };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Erro ao avisar o servidor, mas continuando", error);
    } finally {
      localStorage.removeItem("slotly_token");
      localStorage.removeItem("slotly_user");

      navigate({ to: "/login" });
    }
  };

  return (
    <div className="p-8 flex flex-col gap-4 items-start">
      <h1 className="text-2xl font-bold">🏠 Home Protegida</h1>

      <p className="text-lg">
        Olá, <span className="text-teal-600 font-bold">{user.name}</span>! Se
        você está vendo isso, você está autenticado.
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
      >
        Sair do Sistema (Logout)
      </button>
    </div>
  );
}
