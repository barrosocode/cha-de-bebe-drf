"use client";

import Link from "next/link";
import { useGuests } from "@/lib/api/queries";
import type { ReservationRow } from "@/lib/api/types";
import { formatDateTime } from "@/lib/format";
import { DataTable } from "@/components/ui/DataTable";
import { PageIntro, QueryState } from "@/components/ui/PageIntro";

export default function ReservedPage() {
  const guests = useGuests();
  const rows: ReservationRow[] = (guests.data ?? []).flatMap((guest) =>
    (guest.gifts ?? []).map((selection) => ({
      id: `${guest.uuid}-${selection.gift.uuid}-${selection.selected_at}`,
      guestName: guest.name,
      giftName: selection.gift.name,
      message: selection.message,
      selectedAt: selection.selected_at,
    })),
  );

  return (
    <div>
      <PageIntro
        eyebrow="Quem já escolheu"
        title="Presentes reservados"
        description="Cada linha é uma escolha feita por um convidado, com a mensagem deixada na hora da reserva."
        action={
          <Link className="rounded-full bg-surface-container-high px-5 py-3 font-label-md text-label-md text-on-surface" href="/presentes">
            Ver catálogo
          </Link>
        }
      />
      <QueryState error={guests.error} isLoading={guests.isLoading}>
        <DataTable
          data={rows}
          emptyMessage="Nenhum presente foi reservado ainda."
          searchPlaceholder="Buscar por convidado, presente ou mensagem"
          getSearchText={(row) => `${row.guestName} ${row.giftName} ${row.message}`}
          columns={[
            { key: "gift", header: "Presente", render: (row) => <span className="font-semibold">{row.giftName}</span> },
            { key: "guest", header: "Convidado", render: (row) => row.guestName },
            { key: "message", header: "Mensagem", render: (row) => row.message || "—" },
            { key: "date", header: "Quando", render: (row) => formatDateTime(row.selectedAt) },
          ]}
        />
      </QueryState>
    </div>
  );
}
