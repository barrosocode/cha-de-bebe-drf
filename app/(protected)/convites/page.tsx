"use client";

import Link from "next/link";
import { useState } from "react";
import { notifyRequestError } from "@/lib/api/client";
import { useDeleteResource, useGuests, useInvites } from "@/lib/api/queries";
import type { Invite } from "@/lib/api/types";
import { InviteCreateModal } from "@/components/features/InviteCreateModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable } from "@/components/ui/DataTable";
import { Icon } from "@/components/ui/Icon";
import { PageIntro, QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

export default function InvitesPage() {
  const invites = useInvites();
  const guests = useGuests();
  const remove = useDeleteResource("invites");
  const toast = useToast();
  const [target, setTarget] = useState<Invite | null>(null);
  const [creating, setCreating] = useState(false);

  function countGuests(inviteId: string) {
    return (guests.data ?? []).filter((guest) => guest.invite === inviteId).length;
  }

  function inviteMessage(name: string, code: string) {
    return `Oii, ${name}!

É com muita alegria que queremos convidá-los para o *chá de bebê* de *Catarina* que acontecerá dia 28/11/2026 .

Pedimos que veja os detalhes e confirme sua presença pelo link https://cha-de-bebe-drf.vercel.app/  usando o código

*${code}*

Esperamos vocês.`;
  }

  return (
    <div>
      <PageIntro
        eyebrow="Códigos da família"
        title="Convites"
        description="Cada convite gera um código de 6 caracteres usado no RSVP e na escolha de presentes."
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary" type="button" onClick={() => setCreating(true)}>
            <Icon name="add" />
            Novo convite
          </button>
        }
      />
      <QueryState error={invites.error} isLoading={invites.isLoading}>
        <DataTable
          data={invites.data ?? []}
          searchPlaceholder="Buscar por nome ou código"
          getSearchText={(invite) => `${invite.name} ${invite.code}`}
          columns={[
            { key: "name", header: "Nome", render: (invite) => <span className="font-semibold">{invite.name}</span> },
            { key: "code", header: "Código", render: (invite) => <span className="tracking-widest">{invite.code}</span> },
            { key: "guests", header: "Convidados", render: (invite) => String(countGuests(invite.uuid)) },
            {
              key: "actions",
              header: "Ações",
              className: "text-right",
              render: (invite) => (
                <div className="flex justify-end gap-2">
                  <button
                    className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-label-sm text-label-sm"
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteMessage(invite.name, invite.code));
                      toast.success("Convite copiado.");
                    }}
                  >
                    <Icon name="content_copy" className="text-[16px]" />
                    Copiar
                  </button>
                  <Link className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-label-sm text-label-sm" href={`/convites/${invite.uuid}`}>
                    <Icon name="edit" className="text-[16px]" />
                    Editar
                  </Link>
                  <button className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm text-error" type="button" onClick={() => setTarget(invite)}>
                    <Icon name="delete" className="text-[16px]" />
                    Excluir
                  </button>
                </div>
              ),
            },
          ]}
        />
      </QueryState>
      <InviteCreateModal open={creating} onClose={() => setCreating(false)} />
      <ConfirmDialog
        description={target ? `O convite ${target.name} e o código ${target.code} serão removidos.` : ""}
        open={Boolean(target)}
        pending={remove.isPending}
        title="Excluir convite"
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return;
          try {
            await remove.mutateAsync(target.uuid);
            toast.success("Convite excluído.");
            setTarget(null);
          } catch (error) {
            notifyRequestError(error, toast.error);
          }
        }}
      />
    </div>
  );
}
