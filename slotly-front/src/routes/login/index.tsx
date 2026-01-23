import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, type LoginFormValues } from "./-schema";

export const Route = createFileRoute("/login/")({
  component: Login,
  notFoundComponent: () => <div>404 Not Found</div>,
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("DADOS ENVIADOS: ", data);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="E-mail" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit"> Enviar </button>
      </form>
    </div>
  );
}
