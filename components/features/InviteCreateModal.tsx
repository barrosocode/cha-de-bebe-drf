"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api, notifyRequestError } from "@/lib/api/client";
import { inviteSchema, type InviteValues } from "@/lib/validations/schemas";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";

const inputClass =
  "w-full rounded bg-surface-container-low px-4 font-body-md text-body-md text-on-surface outline-none ring-primary-container placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2";

export function InviteCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "" },
  });

  if (!open) return null;

  const nameError = form.formState.errors.name?.message;
  const rootMessage = form.formState.errors.root?.message;

  async function handleClose() {
    form.reset({ name: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="invite-create-title">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="invite-create-title" className="font-headline-sm text-headline-sm text-on-surface">
              Gerar convite
            </h2>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">O código de acesso é criado pela API e não pode ser alterado aqui.</p>
          </div>
          <button aria-label="Fechar" type="button" onClick={handleClose} disabled={form.formState.isSubmitting}>
            <Icon name="close" />
          </button>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              await api.post("/invites/", { name: values.name });
              await queryClient.invalidateQueries({ queryKey: ["invites"] });
              toast.success("Convite criado.");
              form.reset({ name: "" });
              onClose();
            } catch (error) {
              notifyRequestError(error, toast.error, form.setError);
            }
          })}
        >
          {typeof rootMessage === "string" ? <p className="rounded-lg bg-error-container px-4 py-3 font-body-sm text-body-sm text-on-error-container">{rootMessage}</p> : null}
          <label className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md font-medium text-on-surface">
              Nome do convite<span className="text-primary"> *</span>
            </span>
            <input className={`${inputClass} h-13`} placeholder="Ex.: Família Oliveira" type="text" {...form.register("name")} />
            {nameError ? <span className="font-label-sm text-label-sm text-error">{nameError}</span> : null}
          </label>
          <div className="mt-2 flex justify-end gap-2">
            <button className="rounded-full bg-surface-container-high px-5 py-2 font-label-md text-label-md text-on-surface-variant" type="button" onClick={handleClose} disabled={form.formState.isSubmitting}>
              Cancelar
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-label-md text-label-md text-on-primary disabled:opacity-70" type="submit" disabled={form.formState.isSubmitting}>
              <Icon name="favorite" className="text-[18px]" />
              {form.formState.isSubmitting ? "Salvando..." : "Salvar convite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
