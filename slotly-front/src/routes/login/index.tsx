import { createFileRoute, useNavigate } from "@tanstack/react-router";
//
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";

import { api } from "../../lib/api";
import { LoginSchema, type LoginFormValues } from "./-schema";

export const Route = createFileRoute('/login/')({
  component: Login,
})

export function Login() {
  const [userType, setUserType] = useState<"client" | "provider">("client");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const themeColor = userType === "client" ? "teal" : "blue";

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

      const response = await api.post("/login", data);
      const { token, user } = response.data;

      if (user.role !== userType) {
        console.warn(`Usuário logou na aba errada. Role real: ${user.role}`);
      }

      localStorage.setItem("slotly_token", token);
      localStorage.setItem("slotly_user", JSON.stringify(user));

      if (user.role === "provider") {
        await navigate({ to: "/admin/dashboard" }); // Futura rota
      } else {
        await navigate({ to: "/" }); // Rota de cliente
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Erro ao entrar.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 transition-colors duration-500">
      <div className="rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center gap-6 bg-white">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            {userType === "client" ? "Portal do Cliente" : "Portal do Servidor"}
          </h1>
          <p className="text-gray-400 mt-2">Bem-vindo ao Slotly!</p>
        </div>

        <div className="flex w-full bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setUserType("client")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              userType === "client"
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sou Cliente
          </button>
          <button
            type="button"
            onClick={() => setUserType("provider")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              userType === "provider"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sou Profissional
          </button>
        </div>

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
              placeholder="seu@email.com"
              {...register("email")}
              className={`w-full rounded-lg border p-3 outline-none transition-all 
                    ${userType === "client" ? "focus:ring-teal-600" : "focus:ring-blue-600"} focus:ring-2 focus:border-transparent
                    ${errors.email ? "border-red-500 bg-red-50" : "border-gray-200"}`}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
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
                placeholder="••••••"
                {...register("password")}
                className={`w-full rounded-lg border p-3 outline-none transition-all pr-10 
                      ${userType === "client" ? "focus:ring-teal-600" : "focus:ring-blue-600"} focus:ring-2 focus:border-transparent
                      ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold rounded-xl p-3 transition-colors disabled:opacity-50 
                ${
                  userType === "client"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
          >
            {isSubmitting
              ? "Entrando..."
              : userType === "client"
                ? "Entrar como Cliente"
                : "Entrar no Painel"}
          </button>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
              {serverError}
            </div>
          )}
        </form>

        <div className="flex flex-col gap-3 justify-center items-center text-sm">
          <a
            href="#"
            className={`${userType === "client" ? "text-teal-600" : "text-blue-600"} font-semibold`}
          >
            Esqueceu sua senha?
          </a>
          <p className="text-gray-500">
            Ainda não tem conta?{" "}
            <a
              href={
                userType === "client"
                  ? "/register"
                  : "/register"
              }
              className={`${userType === "client" ? "text-teal-600" : "text-blue-600"} font-bold`}
            >
              Crie agora!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
