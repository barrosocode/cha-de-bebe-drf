"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { api, notifyRequestError } from "@/lib/api/client";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations/schemas";
import { Icon } from "@/components/ui/Icon";
import { PageIntro } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

const inputClass =
  "h-14 w-full rounded bg-surface-container-low pr-12 pl-12 font-body-md text-body-md text-on-surface outline-none ring-primary-container placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2";

type PasswordName = "old_password" | "new_password" | "new_password_confirmation";

export default function ChangePasswordPage() {
  const toast = useToast();
  const [notice, setNotice] = useState("");
  const [visible, setVisible] = useState<Record<PasswordName, boolean>>({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  });
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    setNotice("");
    try {
      const response = await api.post<{ message?: string }>("/auth/change-password/", {
        old_password: values.old_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password_confirmation,
      });
      form.reset();
      const message = response.data.message || "Senha alterada com sucesso";
      setNotice(message);
      toast.success(message);
    } catch (error) {
      notifyRequestError(error, toast.error, form.setError);
    }
  }

  function toggle(name: PasswordName) {
    setVisible((current) => ({ ...current, [name]: !current[name] }));
  }

  const rootMessage = form.formState.errors.root?.message;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <PageIntro
        eyebrow="Conta"
        title="Trocar senha"
        description="Informe a senha atual e escolha uma nova, com no mínimo 8 caracteres. Depois da troca, este acesso continua válido."
      />
      <form className="flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8" onSubmit={form.handleSubmit(onSubmit)}>
        {notice ? <p className="rounded-lg bg-secondary-container px-4 py-3 font-body-sm text-body-sm text-on-secondary-container">{notice}</p> : null}
        {typeof rootMessage === "string" ? <p className="rounded-lg bg-error-container px-4 py-3 font-body-sm text-body-sm text-on-error-container">{rootMessage}</p> : null}
        <PasswordField
          autoComplete="current-password"
          error={form.formState.errors.old_password?.message}
          label="Senha atual"
          registration={form.register("old_password")}
          visible={visible.old_password}
          onToggle={() => toggle("old_password")}
        />
        <PasswordField
          autoComplete="new-password"
          error={form.formState.errors.new_password?.message}
          hint="Mínimo de 8 caracteres."
          label="Nova senha"
          registration={form.register("new_password")}
          visible={visible.new_password}
          onToggle={() => toggle("new_password")}
        />
        <PasswordField
          autoComplete="new-password"
          error={form.formState.errors.new_password_confirmation?.message}
          label="Confirmar nova senha"
          registration={form.register("new_password_confirmation")}
          visible={visible.new_password_confirmation}
          onToggle={() => toggle("new_password_confirmation")}
        />
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-2.5 font-label-md text-label-md text-on-primary shadow-[0_8px_24px_rgba(216,164,169,0.35)] disabled:opacity-70"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            <Icon name="lock" className="text-[18px]" />
            {form.formState.isSubmitting ? "Alterando..." : "Alterar senha"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  hint,
  error,
  autoComplete,
  visible,
  onToggle,
  registration,
}: {
  label: string;
  hint?: string;
  error?: string;
  autoComplete: "current-password" | "new-password";
  visible: boolean;
  onToggle: () => void;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-md text-label-md font-medium text-on-surface">
        {label}
        <span className="text-primary"> *</span>
      </span>
      <span className="relative">
        <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-outline" />
        <input
          autoComplete={autoComplete}
          className={inputClass}
          placeholder="••••••••"
          type={visible ? "text" : "password"}
          {...registration}
        />
        <button
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-outline"
          type="button"
          onClick={onToggle}
        >
          <Icon name={visible ? "visibility_off" : "visibility"} />
        </button>
      </span>
      {hint ? <span className="font-label-sm text-label-sm text-on-surface-variant">{hint}</span> : null}
      {error ? <span className="font-label-sm text-label-sm text-error">{error}</span> : null}
    </label>
  );
}
