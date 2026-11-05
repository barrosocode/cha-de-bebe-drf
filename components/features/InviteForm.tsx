"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api, notifyRequestError } from "@/lib/api/client";
import { useInvite } from "@/lib/api/queries";
import { inviteSchema, type InviteValues } from "@/lib/validations/schemas";
import { DynamicForm, type FormField } from "@/components/ui/DynamicForm";
import { QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

export function InviteForm({ id }: { id: string }) {
  const invite = useInvite(id);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  if (invite.isLoading) return <QueryState error={null} isLoading>{null}</QueryState>;
  if (invite.isError) {
    return <p className="rounded-2xl bg-error-container p-4 text-on-error-container">{axios.isAxiosError(invite.error) && invite.error.response?.status === 404 ? "Convite não encontrado." : "Não foi possível carregar o convite."}</p>;
  }

  const fields: FormField[] = [{ name: "name", label: "Nome do convite", type: "text", required: true, placeholder: "Ex.: Família Oliveira" }];
  if (invite.data?.code) {
    fields.push({ name: "code", label: "Código", type: "readonly", readOnlyValue: invite.data.code, hint: "Gerado automaticamente pela API." });
  }

  return (
    <DynamicForm
      schema={inviteSchema}
      defaultValues={{ name: invite.data?.name ?? "" }}
      fields={fields}
      eyebrow="Convites"
      title="Editar convite"
      description="O código de acesso é criado pela API e não pode ser alterado aqui."
      submitLabel="Atualizar convite"
      cancelHref="/convites"
      breadcrumbs={[{ label: "Convites", href: "/convites" }, { label: "Editar" }]}
      onSubmit={async (values: InviteValues, setError) => {
        try {
          await api.patch(`/invites/${id}/`, { name: values.name });
          await queryClient.invalidateQueries({ queryKey: ["invites"] });
          toast.success("Convite atualizado.");
          router.push("/convites");
        } catch (error) {
          notifyRequestError(error, toast.error, setError);
        }
      }}
    />
  );
}
