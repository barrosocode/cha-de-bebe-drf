"use client";

import Link from "next/link";
import { useState } from "react";
import { notifyRequestError } from "@/lib/api/client";
import { useDeleteResource, useGifts, useGuests } from "@/lib/api/queries";
import type { Gift, Guest } from "@/lib/api/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable } from "@/components/ui/DataTable";
import { Icon } from "@/components/ui/Icon";
import { PageIntro, QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

function chosenCount(guests: Guest[], giftId: string) {
  return guests.reduce((total, guest) => total + (guest.gifts ?? []).filter((item) => item.gift?.uuid === giftId).length, 0);
}

export default function GiftsPage() {
  const gifts = useGifts();
  const guests = useGuests();
  const remove = useDeleteResource("gifts");
  const toast = useToast();
  const [target, setTarget] = useState<Gift | null>(null);
  const rows = gifts.data ?? [];
  const reserved = rows.reduce((total, gift) => total + chosenCount(guests.data ?? [], gift.uuid), 0);

  return (
    <div>
      <PageIntro
        eyebrow="Mimos e homenagens"
        title="Catálogo de presentes"
        description="Gerencie os itens da lista pública. O limite indica quantas vezes cada presente pode ser escolhido."
        action={
          <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary" href="/presentes/novo">
            <Icon name="add" />
            Novo presente
          </Link>
        }
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Cadastrados" value={String(rows.length)} />
        <Stat label="Escolhas registradas" value={String(reserved)} />
        <Stat label="Com imagem" value={String(rows.filter((gift) => gift.files.some((file) => file.image_url)).length)} />
      </div>
      <QueryState error={gifts.error} isLoading={gifts.isLoading}>
        <DataTable
          data={rows}
          searchPlaceholder="Buscar por nome, descrição ou etiqueta"
          getSearchText={(gift) => `${gift.name} ${gift.description} ${gift.tags.map((tag) => tag.name).join(" ")}`}
          columns={[
            {
              key: "item",
              header: "Item",
              render: (gift) => {
                const image = gift.files.find((file) => file.image_url)?.image_url;
                return (
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-surface-container">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" className="h-full w-full object-cover" src={image} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-primary">
                          <Icon name="card_giftcard" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{gift.name}</p>
                      <p className="font-label-sm text-label-sm text-tertiary">{gift.tags.map((tag) => tag.name).join(" • ") || "Sem etiquetas"}</p>
                    </div>
                  </div>
                );
              },
            },
            {
              key: "link",
              header: "Link",
              render: (gift) => (
                <a className="text-primary underline" href={gift.link} rel="noreferrer" target="_blank">
                  Abrir
                </a>
              ),
            },
            {
              key: "limit",
              header: "Escolhas",
              render: (gift) => {
                const chosen = chosenCount(guests.data ?? [], gift.uuid);
                const width = gift.limit > 0 ? Math.min(100, (chosen / gift.limit) * 100) : 0;
                return (
                  <div className="w-36">
                    <div className="mb-1 flex justify-between font-label-sm text-label-sm text-tertiary">
                      <span>{chosen} de {gift.limit}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              },
            },
            {
              key: "status",
              header: "Status",
              render: (gift) => {
                const full = chosenCount(guests.data ?? [], gift.uuid) >= gift.limit;
                return <span className="font-label-md text-label-md">{full ? "Limite atingido" : "Disponível"}</span>;
              },
            },
            {
              key: "actions",
              header: "Ações",
              className: "text-right",
              render: (gift) => (
                <div className="flex justify-end gap-2">
                  <Link className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 font-label-sm text-label-sm" href={`/presentes/${gift.uuid}`}>
                    <Icon name="edit" className="text-[16px]" />
                    Editar
                  </Link>
                  <button className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-label-sm text-label-sm text-error" type="button" onClick={() => setTarget(gift)}>
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
        description={target ? `O presente ${target.name} será removido do catálogo.` : ""}
        open={Boolean(target)}
        pending={remove.isPending}
        title="Excluir presente"
        onClose={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return;
          try {
            await remove.mutateAsync(target.uuid);
            toast.success("Presente excluído.");
            setTarget(null);
          } catch (error) {
            notifyRequestError(error, toast.error);
          }
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_24px_rgba(216,164,169,0.12)]">
      <p className="font-label-sm text-label-sm tracking-wider text-tertiary uppercase">{label}</p>
      <p className="mt-1 font-headline-md text-headline-md font-semibold text-on-surface">{value}</p>
    </article>
  );
}
