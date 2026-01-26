import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { LoginSchema, type LoginFormValues } from "./-schema";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../lib/api";
import { AxiosError } from "axios";

export const Route = createFileRoute("/login/")({
  component: Login,
  notFoundComponent: () => <div>404 Not Found</div>,
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);

      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("slotly_token", token);

      localStorage.setItem("slotly_user", JSON.stringify(user));

      await navigate({ to: "/" });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setServerError("E-mail ou senha incorretos.");
        } else {
          setServerError("Erro no servidor. Tente novamente mais tarde.");
        }
      } else {
        setServerError("Erro inesperado.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="font-bold text-4xl">Client Portal</h1>
          <p className="text-gray-400">
            Bem-vindo ao Slotly! Faça seu login para continuar.
          </p>
        </div>
        <a
          href="#"
          className="bg-gray-500 w-full text-white flex flex-col justify-center items-center p-3 rounded-xl"
        >
          Faça login com o google
        </a>
        <p className="text-gray-500 font-light">OU</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail."
              className={`
            w-full rounded-lg border p-3 outline-none transition-all
            focus:ring-2 focus:ring-teal-600 focus:border-transparent
            ${errors.email ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}
            `}
              aria-invalid={!!errors.email}
              {...register("email")}
            />

            {errors.email && (
              <span role="alert" className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {" "}
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha."
                className={`
                w-full rounded-lg border p-3 outline-none transition-all pr-10 
                focus:ring-2 focus:ring-teal-600 focus:border-transparent
                ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}
              `}
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal-600 text-white font-bold w-full rounded-xl p-1 hover:bg-teal-600 hover:transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
              <p>{serverError}</p>
            </div>
          )}
        </form>
        <div className="flex flex-col gap-3 justify-center items-center">
          <a href="#" className="text-teal-600 font-semibold">
            Esqueceu sua senha?
          </a>
          <a href="#" className="text-gray-500">
            É um prestador? Faça login aqui.
          </a>
        </div>
      </div>
    </div>
  );
}
