import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";
import { AxiosError } from "axios";
import {
  ProviderRegisterSchema,
  type ProviderRegisterFormValues,
} from "./-schema";

export const Route = createFileRoute("/register/provider")({
  component: ProviderRegister,
});

function ProviderRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderRegisterFormValues>({
    resolver: zodResolver(ProviderRegisterSchema),
  });

  const onSubmit = async (data: ProviderRegisterFormValues) => {
    try {
      setServerError(null);
      const response = await api.post("/register", {
        ...data,
        role: "provider",
      });

      const { token, user } = response.data;
      localStorage.setItem("slotly_token", token);
      localStorage.setItem("slotly_user", JSON.stringify(user));

      await navigate({ to: "/onboarding/1" });
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Erro ao criar conta.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:block w-1/2 relative bg-blue-900">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute top-8 left-8">
          <Link
            to="/register"
            className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} /> Voltar
          </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Gerencie seu negócio.</h2>
          <p className="text-blue-100 text-lg">
            Ferramentas poderosas para profissionais que querem crescer.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-md w-full space-y-8">
          <div className="lg:hidden mb-6">
            <Link
              to="/register"
              className="text-gray-500 flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Voltar
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Crie uma conta para seu negócio!
            </h2>
            {/* <p className="mt-2 text-sm text-gray-500">
              Start your 14-day free trial. No credit card required.
            </p> */}
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("name")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-600 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Corporativo
                </label>
                <input
                  type="email"
                  placeholder="seu@trabalho.com"
                  {...register("email")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nome do seu Negócio
                </label>
                <input
                  type="text"
                  placeholder="Ex: Barbearia do Zé"
                  {...register("business_name")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-600 ${errors.business_name ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    {...register("password")}
                    className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-600 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <input
                type="hidden"
                value="temp"
                {...register("password_confirmation")}
              />
             
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirme a senha
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  {...register("password_confirmation")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-600 ${errors.password_confirmation ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Google
              </button>
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Microsoft
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
