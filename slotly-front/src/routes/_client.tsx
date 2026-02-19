import {
  createFileRoute,
  redirect,
  Outlet,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import { Search, Calendar, Settings, LogOut } from "lucide-react";

export const Route = createFileRoute("/_client")({
  beforeLoad: () => {
    const token = localStorage.getItem("slotly_token");
    const userJson = localStorage.getItem("slotly_user");

    if (!token || !userJson) {
      throw redirect({ to: "/login" });
    }

    try {
      const user = JSON.parse(userJson);

      if (user.role === "provider") {
        throw redirect({ to: "/event-types" });
      } else if (user.role !== "client") {
        localStorage.removeItem("slotly_token");
        localStorage.removeItem("slotly_user");
        throw redirect({ to: "/login" });
      }
    } catch (e) {
      localStorage.removeItem("slotly_token");
      localStorage.removeItem("slotly_user");
      throw redirect({ to: "/login" });
    }
  },
  component: ClientLayout,
});

function ClientLayout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("slotly_token");
    localStorage.removeItem("slotly_user");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar do Cliente */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full left-0 top-0 overflow-y-auto">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#20C997] rounded-lg flex items-center justify-center font-bold text-white">
            S
          </div>
          <div>
            <h1 className="font-black text-lg text-gray-900 leading-tight">
              Slotly
            </h1>
            <p className="text-xs text-gray-500 font-medium">Área do Cliente</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem
            to="/"
            icon={<Search size={20} />}
            label="Procurar Agendamento"
            active={currentPath === "/"}
          />
          <SidebarItem
            to="/appointments"
            icon={<Calendar size={20} />}
            label="Meus Agendamentos"
            active={currentPath.includes("appointments")}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Configurações"
            active={currentPath.includes("settings")}
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full p-3 rounded-xl hover:bg-red-50 font-bold"
          >
            <LogOut size={20} />
            <span className="text-sm">Sair da conta</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
