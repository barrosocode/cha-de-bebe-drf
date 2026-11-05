"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AGE_OPTIONS, CATEGORY_OPTIONS } from "@/lib/brand";
import { api, notifyRequestError } from "@/lib/api/client";
import { useGuest, useInvites } from "@/lib/api/queries";
import type { Guest } from "@/lib/api/types";
import { guestSchema, type GuestValues } from "@/lib/validations/schemas";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

export function GuestForm({ id }: { id: string }) {
  const isNew = id === "novo";
  const guest = useGuest(id);
  const invites = useInvites();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  async function save(values: GuestValues) {
    const payload = {
      name: values.name,
      age: values.age,
      category: values.category,
      phone: values.phone || null,
      invite: values.invite,
    };
    if (isNew) await api.post<Guest>("/guests/", payload);
    else await api.patch<Guest>(`/guests/${id}/`, payload);
    await queryClient.invalidateQueries({ queryKey: ["guests"] });
    toast.success(isNew ? "Convidado cadastrado." : "Convidado atualizado.");
    router.push("/convidados");
  }

  if (!isNew && (guest.isLoading || invites.isLoading)) return <QueryState error={null} isLoading>{null}</QueryState>;
  if (!isNew && guest.isError) {
    return <p className="rounded-2xl bg-error-container p-4 text-on-error-container">{axios.isAxiosError(guest.error) && guest.error.response?.status === 404 ? "Convidado não encontrado." : "Não foi possível carregar o convidado."}</p>;
  }

  const current = guest.data;

  return (
    <DynamicForm
      schema={guestSchema}
      defaultValues={{
        name: current?.name ?? "",
        age: current?.age ?? "adult",
        category: current?.category ?? "family",
        phone: current?.phone ?? "",
        invite: current?.invite ?? "",
      }}
      eyebrow="Convidados"
      title={isNew ? "Cadastrar convidado" : "Editar convidado"}
      description="Nome, telefone e o convite ao qual esta pessoa pertence."
      submitLabel={isNew ? "Salvar convidado" : "Atualizar convidado"}
      cancelHref="/convidados"
      breadcrumbs={[{ label: "Convidados", href: "/convidados" }, { label: isNew ? "Cadastrar" : "Editar" }]}
      banner={current ? <p className="rounded-lg bg-surface-container px-4 py-3 font-body-sm text-body-sm">Presença: {current.confirmed ? "confirmada" : "pendente"}. Esse status muda pelo RSVP do convite.</p> : null}
      fields={[
        { name: "name", label: "Nome", type: "text", required: true, placeholder: "Nome do convidado" },
        { name: "age", label: "Idade", type: "select", required: true, options: [...AGE_OPTIONS] },
        { name: "category", label: "Categoria", type: "select", required: true, options: [...CATEGORY_OPTIONS] },
        { name: "phone", label: "Telefone", type: "phone", hint: "Formato (99) 9 9999-9999. Pode ficar em branco." },
        {
          name: "invite",
          label: "Convite",
          type: "select",
          required: true,
          placeholder: invites.isLoading ? "Carregando convites..." : invites.data?.length ? "Selecione o convite" : "Cadastre um convite antes",
          options: (invites.data ?? []).map((invite) => ({ value: invite.uuid, label: `${invite.name} • ${invite.code}` })),
        },
      ]}
      onSubmit={async (values, setError) => {
        try {
          await save(values);
        } catch (error) {
          notifyRequestError(error, toast.error, setError);
        }
      }}
    />
  );
}
