import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api } from "../../lib/api";
import { AxiosError } from "axios";
import { SlugSchema, type SlugFormValues } from "./-schema1";

export const Route = createFileRoute("/onboarding/1")({
  beforeLoad: () => {
    if (!localStorage.getItem("slotly_token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: OnboardingStep1,
});

function OnboardingStep1() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("slotly_user") || "{}");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SlugFormValues>({
    resolver: zodResolver(SlugSchema),
  });

  const onSubmit = async (data: SlugFormValues) => {
    try {
      setServerError(null);

      await api.put("/user/setup-slug", data);

      await navigate({ to: "/onboarding/2" });
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Erro ao salvar URL.");
      }
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            S
          </div>
          Slotly
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>

      <div className="w-full max-w-4xl mb-8">
        <p className="text-sm font-medium text-gray-900 mb-2">Step 1 of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-1/3 transition-all duration-500"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span className="text-blue-600">Business URL</span>
          <span>Profile Setup</span>
          <span>Availability</span>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Bem-vindo! Vamos configurar sua página.
        </h1>
        <p className="text-gray-500 mb-8">
          Escolha uma URL única onde seus clientes poderão te encontrar.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sua URL de Negócios
            </label>

            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                slotly.com/
              </span>
              <input
                type="text"
                placeholder="nome-do-seu-negocio"
                {...register("business_slug")}
                className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-lg border outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm ${errors.business_slug ? `border-red-500` : `border-gray-300`}`}
              />
            </div>

            {errors.business_slug ? (
              <p className="mt-2 text-sm text-red-600">
                {errors.business_slug.message}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">
                Use apenas letras, números e hífens.
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Verificando..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
