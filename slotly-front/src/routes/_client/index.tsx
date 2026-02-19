import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Search,
  Loader2,
  AlertCircle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { api } from "../../lib/api";
import { useDebounce } from "../../lib/use-debounce";
import { ProviderCard } from "../../components/client/Provider";
import type { ProviderSummary } from "../../types/Provider";

const clientSearchSchema = z.object({
  q: z.string().optional().catch(""),
  category: z.string().optional().catch(""),
  page: z.number().optional().catch(1),
});

export const Route = createFileRoute("/_client/")({
  validateSearch: clientSearchSchema,
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();

  const userString = localStorage.getItem("slotly_user");
  const user = userString ? JSON.parse(userString) : { name: "Usuário" };

  const debouncedSearch = useDebounce(searchParams.q, 500);
  const currentPage = searchParams.page || 1;

  const {
    data: providersPaginated,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "providers",
      debouncedSearch,
      searchParams.category,
      currentPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (searchParams.category)
        params.append("category", searchParams.category);
      params.append("page", currentPage.toString());

      const response = await api.get(`/providers?${params.toString()}`);
      return response.data;
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    navigate({
      search: (prev) => ({
        ...prev,
        q: value || undefined,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    navigate({
      search: (prev) => ({
        ...prev,
        category: value || undefined,
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const providersList = providersPaginated?.data || [];
  const lastPage = providersPaginated?.last_page || 1;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          Encontre seu próximo agendamento,{" "}
          <span className="text-[#20C997]">{user.name}</span>.
        </h1>
        <p className="text-gray-500 font-medium">
          Pesquise por profissionais, serviços ou categorias disponíveis.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome ou serviço..."
            value={searchParams.q || ""}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#20C997]/20 focus:border-[#20C997] outline-none transition-all font-medium text-gray-700"
          />
        </div>

        <select
          value={searchParams.category || ""}
          onChange={handleCategoryChange}
          className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#20C997]/20 focus:border-[#20C997] outline-none transition-all font-medium text-gray-700 appearance-none cursor-pointer"
        >
          <option value="">Todas as categorias</option>
          <option value="beleza">Beleza & Estética</option>
          <option value="saude">Saúde</option>
          <option value="consultoria">Consultoria</option>
        </select>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black text-gray-900">
          Resultados da pesquisa
        </h2>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-medium gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#20C997]" />
            <p>Buscando os melhores profissionais...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4 text-red-600">
            <AlertCircle size={24} />
            <div>
              <p className="font-bold">Ops! Algo deu errado.</p>
              <p className="text-sm">
                Não conseguimos carregar os profissionais. Tente novamente.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && providersList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <CalendarClock size={48} className="mb-4 text-gray-300" />
            <p className="font-bold text-lg text-gray-600">
              Nenhum profissional encontrado.
            </p>
            <p className="text-sm">
              Tente ajustar sua busca ou mudar a categoria.
            </p>
          </div>
        )}

        {!isLoading && providersList.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providersList.map((provider: ProviderSummary) => (
                console.log(providersList),
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-bold text-gray-600">
                  Página {currentPage} de {lastPage}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
