"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { LOGO_SRC } from "@/lib/brand";
import type { User } from "@/lib/api/types";
import { loginSchema, type LoginValues } from "@/lib/validations/schemas";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginValues) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json().catch(() => ({}))) as { user?: User; detail?: string | string[]; non_field_errors?: string[]; username?: string[]; password?: string[] };
    if (!response.ok) {
      const detail = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
      const formError = data.non_field_errors?.join(" ") || detail;
      if (data.username?.[0]) form.setError("username", { message: data.username.join(" ") });
      if (data.password?.[0]) form.setError("password", { message: data.password.join(" ") });
      if (formError) form.setError("root", { message: formError });
      if (!data.username && !data.password && !formError) form.setError("root", { message: "Não foi possível entrar." });
      return;
    }
    if (data.user) queryClient.setQueryData(["me"], data.user);
    router.push("/dashboard");
    router.refresh();
  }

  const rootMessage = form.formState.errors.root?.message;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-fixed/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-28 h-[28rem] w-[28rem] rounded-full bg-secondary-fixed/20 blur-3xl" />
      <div className="relative w-full max-w-xl">
        <div className="flex flex-col items-center rounded-xl bg-surface-container-lowest/90 p-6 shadow-xl shadow-primary-container/20 backdrop-blur-md sm:p-10">
          <div className="mb-4 flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-on-surface-variant">
            <Icon name="verified_user" className="text-sm text-secondary" filled />
            <span className="font-label-sm text-label-sm tracking-widest uppercase">Área exclusiva e segura</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Monograma Catarina" className="mb-2 h-28 w-28 object-contain sm:h-32 sm:w-32" src={LOGO_SRC} />
          <div className="mb-6 text-center">
            <h1 className="font-headline-lg text-headline-lg text-primary">Painel dos Papais</h1>
            <p className="mx-auto max-w-sm font-body-md text-body-md text-on-surface-variant">Acompanhe confirmações de presença, lista de presentes e recados com todo o carinho.</p>
          </div>
          <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between font-label-md text-label-md text-on-surface">
                Usuário de acesso
                <span className="font-body-sm text-xs text-on-surface-variant/70">Apenas organizadores</span>
              </span>
              <span className="relative">
                <Icon name="mail" className="absolute top-1/2 left-4 -translate-y-1/2 text-outline" />
                <input autoComplete="username" className="h-14 w-full rounded-full bg-surface-container-low pr-4 pl-12 font-body-md text-body-md outline-none focus:bg-surface-container-lowest" placeholder="usuario" {...form.register("username")} />
              </span>
              {form.formState.errors.username ? <span className="font-label-sm text-label-sm text-error">{form.formState.errors.username.message}</span> : null}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-label-md text-label-md text-on-surface">Senha de acesso</span>
              <span className="relative">
                <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-outline" />
                <input autoComplete="current-password" className="h-14 w-full rounded-full bg-surface-container-low pr-12 pl-12 font-body-md text-body-md outline-none focus:bg-surface-container-lowest" placeholder="••••••••••••" type={showPassword ? "text" : "password"} {...form.register("password")} />
                <button aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute top-1/2 right-4 -translate-y-1/2 text-outline" type="button" onClick={() => setShowPassword((value) => !value)}>
                  <Icon name={showPassword ? "visibility_off" : "visibility"} />
                </button>
              </span>
              {form.formState.errors.password ? <span className="font-label-sm text-label-sm text-error">{form.formState.errors.password.message}</span> : null}
            </label>
            <label className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <input className="h-4 w-4 accent-primary" type="checkbox" {...form.register("remember")} />
              Lembrar de mim neste dispositivo
            </label>
            {typeof rootMessage === "string" ? <p className="rounded-lg bg-error-container px-4 py-3 text-center font-body-sm text-body-sm text-on-error-container">{rootMessage}</p> : null}
            <button className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary-container font-label-lg text-label-lg text-on-primary shadow-md hover:bg-primary disabled:opacity-70" disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Validando acesso..." : "Entrar no painel"}
              <Icon name="arrow_forward" />
            </button>
          </form>
          <Link className="mt-6 inline-flex items-center gap-1.5 font-label-md text-label-md text-primary" href="/">
            <Icon name="arrow_back" className="text-base" />
            Voltar para a página do Chá de Bebê
          </Link>
        </div>
        <p className="mt-4 text-center font-label-sm text-label-sm tracking-wide text-outline">CHÁ DA CATARINA • PORTAL DA FAMÍLIA • 2025</p>
      </div>
    </main>
  );
}
