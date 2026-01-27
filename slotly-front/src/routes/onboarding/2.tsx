import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { api } from "../../lib/api";
import { ProfileSchema, type ProfileFormValues } from "./-schema2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, User } from "lucide-react";

export const Route = createFileRoute("/onboarding/2")({
  component: OnboardingStep2,
});

function OnboardingStep2() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
  });

  // Lógica visual para pré-visualizar a imagem selecionada
  const photoFiles = watch("photo");
  useEffect(() => {
    if (photoFiles && photoFiles.length > 0) {
      const file = photoFiles[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Limpeza de memória
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [photoFiles]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setServerError(null);
      const formData = new FormData();

      if (data.bio) {
        formData.append("bio", data.bio);
      }

      if (data.photo && data.photo.length > 0) {
        formData.append("profile_photo_path", data.photo[0]);
      }

      await api.post("/user/profile-update", formData);

      await navigate({ to: "/onboarding/3" });

    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(
          error.response?.data?.message || "Erro ao atualizar perfil.",
        );
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
        <p className="text-sm font-medium text-gray-900 mb-2">Step 2 of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-2/3 transition-all duration-500"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span className="text-blue-600">Business URL</span>
          <span className="text-blue-600">Profile Setup</span>
          <span>Availability</span>
        </div>
      </div>

      {/* Card do Formulário */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Dê uma cara ao seu negócio
            </h1>
            <p className="text-gray-500 text-sm">
              Adicione uma foto e uma breve descrição para seus clientes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-gray-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-all"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  {...register("photo")}
                />
              </label>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-medium text-gray-900">Foto de Perfil</h3>
              <p className="text-sm text-gray-500">
                Isso será exibido no seu perfil público. Recomendamos uma imagem
                quadrada de pelo menos 400x400px.
              </p>
              {errors.photo && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.photo.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sobre você / Seu negócio
            </label>
            <textarea
              rows={4}
              placeholder="Conte um pouco sobre sua experiência e o que você oferece..."
              {...register("bio")}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all resize-none ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between mt-2">
              {errors.bio ? (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              ) : (
                <p className="text-xs text-gray-400">Opcional</p>
              )}
              <p className="text-xs text-gray-400 text-right">
                Máx. 1000 caracteres
              </p>
            </div>
          </div>

          {serverError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Salvando..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
