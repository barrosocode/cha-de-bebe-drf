"use client";

import Link from "next/link";
import { useState } from "react";
import { AGE_OPTIONS, CATEGORY_OPTIONS, labelOf } from "@/lib/brand";
import { notifyRequestError } from "@/lib/api/client";
import { useDeleteResource, useGuests, useInvites } from "@/lib/api/queries";
import type { Guest } from "@/lib/api/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable } from "@/components/ui/DataTable";
import { Icon } from "@/components/ui/Icon";
import { PageIntro, QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

export default function GuestsPage() {
  const guests = useGuests();
  const invites = useInvites();
  const remove = useDeleteResource("guests");
  const toast = useToast();
  const [target, setTarget] = useState<Guest | null>(null);
  const inviteName = new Map((invites.data ?? []).map((invite) => [invite.uuid, invite.name]));

  return (
    <div>
      <PageIntro
        eyebrow="Família e amigos"
        title="Convidados"
        description="Consulte quem foi chamado, o convite de cada pessoa e se a presença já foi confirmada."
        action={
          <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary" href="/convidados/novo">
            <Icon name="add" />
            Novo convidado
          </Link>
        }
      />
      <QueryState error={guests.error} isLoading={guests.isLoading}>
        <DataTable
          data={guests.data ?? []}
          searchPlaceholder="Buscar por nome, telefone ou categoria"
          getSearchText={(guest) => `${guest.name} ${guest.phone ?? ""} ${labelOf(CATEGORY_OPTIONS, guest.category)} ${inviteName.get(guest.invite) ?? ""}`}
          columns={[
            { key: "name", header: "Nome", render: (guest) => <span className="font-semibold">{guest.name}</span> },
            { key: "phone", header: "Telefone", render: (guest) => guest.phone || "—" },
            { key: "age", header: "Idade", render: (guest) => labelOf(AGE_OPTIONS, guest.age) },
            { key: "category", header: "Categoria", render: (guest) => labelOf(CATEGORY_OPTIONS, guest.category) },
            { key: "invite", header: "Convite", render: (guest) => inviteName.get(guest.invite) ?? "—" },
            {
              key: "confirmed",
              header: "Presença",
              render: (guest) => (
                <span className={`rounded-full px-3 py-1 font-label-sm text-label-sm ${guest.confirmed ? "bg-primary-fixed text-on-primary-fixed" : "bg-secondary-container text-on-secondary-container"}`}>
                  {guest.confirmed ? "Confirmado" : "Pendente"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Ações",
              className: "text-right",
              render: (guest) => (
                <div className="flex justify-end gap-2">
                  <Link className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-label-sm text-label-sm" href={`/convidados/${guest.uuid}`}>
                    <Icon name="edit" className="text-[16px]" />
                    Editar
                  </Link>
                  <button className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm text-error" type="button" onClick={() => setTarget(guest)}>
                    <Icon name="delete" className="text-[16px]" />
                    Excluir
                  </button>
                </div>
              ),
            },
          ]}
        />
      </QueryState>
      <ConfirmDialog
        description={target ? `O convidado ${target.name} será removido da lista.` : ""}
        open={Boolean(target)}
        pending={remove.isPending}
        title="Excluir convidado"
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return;
          try {
            await remove.mutateAsync(target.uuid);
            toast.success("Convidado excluído.");
            setTarget(null);
          } catch (error) {
            notifyRequestError(error, toast.error);
          }
        }}
      />
    </div>
  );
}
