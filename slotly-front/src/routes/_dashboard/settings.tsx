import { useForm } from "react-hook-form";
import * as Switch from "@radix-ui/react-switch";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../../lib/api";
import { SettingsSchema, type SettingsFormValues } from "./-profile-schema";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

export function SettingsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = JSON.parse(localStorage.getItem("slotly_user") || "{}");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const response = await api.post("/user/profile-update", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("slotly_user", JSON.stringify(data.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });

      alert("Informações salvas com sucesso!");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profile_photo_path", file);
      const response = await api.post("/user/profile-update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("slotly_user", JSON.stringify(data.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const onSubmit = (data: any) => {
    const payload: any = {
      name: data.name,
      phone: data.phone,
      bio: data.bio,
    };
    if (data.new_password) {
      payload.current_password = data.current_password;
      payload.new_password = data.new_password;
      payload.new_password_confirmation = data.new_password;
    }

    profileMutation.mutate(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <div className="p-6 sm:p-10 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <h1 className="text-3xl sm:text-4xl font-black text-[#1A202C] mb-8 sm:mb-10 tracking-tight">
        Perfil e Configurações.
      </h1>

      <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={user.profile_photo_path || "https://github.com/shadcn.png"}
              alt={user.name}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover transition-all ${
                uploadMutation.isPending
                  ? "opacity-30"
                  : "group-hover:brightness-90"
              }`}
            />
            {uploadMutation.isPending ? (
              <Loader2
                className="absolute inset-0 m-auto animate-spin text-[#20C997]"
                size={32}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-white" size={24} />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              {user.name}
            </h2>
            <p className="text-gray-400 font-medium text-sm sm:text-base">
              {user.email}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="sm:ml-auto flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 disabled:opacity-50"
          >
            <Upload size={18} />
            <span>Upload new picture</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-10 space-y-10 sm:space-y-12"
        >
          <section className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <InputField
                label="Full Name"
                error={errors.name}
                {...register("name")}
              />
              <InputField
                label="Email Address"
                type="email"
                disabled
                error={errors.email}
                {...register("email")}
              />
              <InputField
                label="Phone Number"
                error={errors.phone}
                {...register("phone")}
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <InputField
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={errors.current_password}
                {...register("current_password")}
              />
              <InputField
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.new_password}
                {...register("new_password")}
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Preferences
            </h3>
            <div className="space-y-4">
              <ToggleItem
                label="Email appointment reminders"
                description="Receive an email 24 hours before your appointment."
                defaultChecked
              />
              <ToggleItem
                label="SMS notifications"
                description="Get a text message for confirmations and reminders."
              />
            </div>
          </section>

          <div className="pt-8 sm:pt-10 border-t border-gray-100 flex justify-end items-center gap-6 sm:gap-8">
            <button
              type="button"
              className="text-gray-400 font-black hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="bg-[#20C997] hover:bg-[#18A078] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-black shadow-lg shadow-teal-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {profileMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {profileMutation.isPending ? "Salvando..." : "Salvar Mudanças"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares com Suporte a Erros ---

function InputField({ label, error, ...props }: any) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <label className="text-xs font-black text-gray-400 uppercase ml-1">
        {label}
      </label>
      <input
        className={`w-full bg-gray-50 border rounded-2xl px-5 py-4 text-gray-700 font-medium outline-none transition-all disabled:opacity-50 
          ${error ? "border-red-500 focus:ring-red-50" : "border-gray-100 focus:ring-[#20C997] focus:bg-white"}
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-tight">
          {error.message}
        </span>
      )}
    </div>
  );
}

function ToggleItem({ label, description, defaultChecked = false }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="space-y-0.5 pr-4">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 font-medium">{description}</p>
      </div>
      <Switch.Root
        defaultChecked={defaultChecked}
        className="w-12 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-[#20C997] outline-none cursor-pointer transition-colors shrink-0"
      >
        <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-7" />
      </Switch.Root>
    </div>
  );
}
