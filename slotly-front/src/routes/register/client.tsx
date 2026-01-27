import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";
import { AxiosError } from "axios";
import { ClientRegisterSchema, type ClientRegisterFormValues } from "./-schema";

export const Route = createFileRoute("/register/client")({
  component: ClientRegister,
});

function ClientRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientRegisterFormValues>({
    resolver: zodResolver(ClientRegisterSchema),
  });

  const onSubmit = async (data: ClientRegisterFormValues) => {
    try {
      setServerError(null);
      const response = await api.post("/register", { ...data, role: "client" }); // Role fixo

      const { token, user } = response.data;
      localStorage.setItem("slotly_token", token);
      localStorage.setItem("slotly_user", JSON.stringify(user));

      await navigate({ to: "/" });
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Erro ao criar conta.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* --- LADO ESQUERDO (IMAGEM) --- */}
      {/* hidden lg:block -> Só aparece em telas grandes */}
      <div className="hidden lg:block w-1/2 relative bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
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
          <h2 className="text-4xl font-bold mb-4">
            Agendamentos simplificados.
          </h2>
          <p className="text-gray-300 text-lg">
            Junte-se a milhares de clientes que organizam sua vida com o Slotly.
          </p>
        </div>
      </div>

      {/* --- LADO DIREITO (FORMULÁRIO) --- */}
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
              Crie sua conta de Cliente
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Comece a agendar seus serviços favoritos hoje mesmo.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  {...register("name")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-teal-600 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  E-mail Profissional
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-teal-600 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...register("password")}
                      className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-teal-600 ${errors.password ? "border-red-500" : "border-gray-200"}`}
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

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••"
                    {...register("password_confirmation")}
                    className={`mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-teal-600 ${errors.password_confirmation ? "border-red-500" : "border-gray-200"}`}
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
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
              className="w-full flex justify-center py-3 px-4 border border-transparent font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Criando..." : "Criar Conta"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OU</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="sr-only">Google</span>
                Google
              </button>
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="sr-only">Microsoft</span>
                Microsoft
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-bold text-teal-600 hover:text-teal-500"
            >
              Faça Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
