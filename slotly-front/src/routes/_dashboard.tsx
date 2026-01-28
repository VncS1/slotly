import {
  createFileRoute,
  redirect,
  Outlet,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Link as LinkIcon,
  Settings,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: () => {
    const token = localStorage.getItem("slotly_token");
    const userJson = localStorage.getItem("slotly_user");

    if (!token || !userJson) {
      throw redirect({ to: "/login" });
    }

    try {
      const user = JSON.parse(userJson);

      if (user.role !== "provider") {
        throw redirect({ to: "/" });
      }
    } catch (e) {
      localStorage.removeItem("slotly_token");
      localStorage.removeItem("slotly_user");
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("slotly_token");
    localStorage.removeItem("slotly_user");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col fixed h-full left-0 top-0 overflow-y-auto">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AgendamentoPro</h1>
            <p className="text-xs text-slate-400">Provider Workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarItem
            to="/event-types"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={currentPath === "/event-types"}
          />
          <SidebarItem
            to="/scheduled-events"
            icon={<Calendar size={20} />}
            label="Scheduled Events"
            active={currentPath.includes("scheduled")}
          />
          <SidebarItem
            to="/availability"
            icon={<Clock size={20} />}
            label="Availability"
            active={currentPath.includes("availability")}
          />
          <SidebarItem
            to="/integrations"
            icon={<LinkIcon size={20} />}
            label="Integrations"
            active={currentPath.includes("integrations")}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            active={currentPath.includes("settings")}
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
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
