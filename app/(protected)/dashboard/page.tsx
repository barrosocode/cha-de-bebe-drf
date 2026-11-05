"use client";

import Link from "next/link";
import { EVENT } from "@/lib/brand";
import { useDashboard } from "@/lib/api/queries";
import { getErrorMessage } from "@/lib/api/client";
import { formatPercent, formatRelative } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export default function DashboardPage() {
  const dashboard = useDashboard();

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
      <section className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-lowest p-6 shadow-sm lg:flex-row lg:items-center lg:p-10">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/80 px-3 py-1 font-label-sm text-label-sm text-secondary">
            <Icon name="favorite" className="text-[16px]" filled />
            {EVENT.dateLabel} • {EVENT.time}
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Bem-vindos ao painel do chá da Catarina</h1>
          <p className="mt-2 max-w-2xl font-body-md text-body-md text-on-surface-variant">Acompanhe confirmações de presença e mimos reservados em um só lugar.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-2.5 font-label-md text-label-md text-on-secondary-fixed" href="/convidados/novo">
            <Icon name="person_add" className="text-[18px]" />
            Novo convidado
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary" href="/presentes/novo">
            <Icon name="add_box" className="text-[18px]" />
            Adicionar presente
          </Link>
        </div>
      </section>

      {dashboard.isLoading ? <div className="h-48 animate-pulse rounded-xl bg-surface-container-low" /> : null}
      {dashboard.isError ? <p className="rounded-xl bg-error-container p-4 text-on-error-container">{getErrorMessage(dashboard.error)}</p> : null}

      {dashboard.data ? <DashboardContent data={dashboard.data} /> : null}
    </div>
  );
}

function DashboardContent({
  data,
}: {
  data: {
    total_invites: number;
    total_guests: number;
    confirmed_guests: number;
    confirmation_rate: number;
    total_gifts: number;
    reserved_gifts: number;
    reservation_rate: number;
    recent_reservations: { guest_name: string; gift_name: string; message: string; reserved_at: string }[];
  };
}) {
  const pending = Math.max(0, data.total_guests - data.confirmed_guests);
  const confirmationWidth = `${Math.min(100, Math.max(0, data.confirmation_rate))}%`;
  const reservationWidth = `${Math.min(100, Math.max(0, data.reservation_rate))}%`;

  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <Metric icon="group" label="Total de convidados" value={String(data.total_guests)} hint={`${data.confirmed_guests} confirmados • ${pending} pendentes`} />
        <Metric icon="drafts" label="Convites emitidos" value={String(data.total_invites)} hint="famílias" />
        <Metric icon="card_giftcard" label="Presentes no catálogo" value={String(data.total_gifts)} hint="itens cadastrados" />
        <article className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">Mimos reservados</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/50 text-on-secondary-container">
              <Icon name="volunteer_activism" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="font-display text-display font-semibold text-on-surface">{data.reserved_gifts}</span>
            <span className="font-label-md text-label-md font-bold text-primary">{formatPercent(data.reservation_rate)}</span>
          </div>
          <p className="mb-3 font-label-sm text-label-sm text-on-surface-variant">Presentes com pelo menos uma escolha</p>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary-fixed-dim" style={{ width: reservationWidth }} />
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <article className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm lg:col-span-7 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Estatísticas de presença</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{data.confirmed_guests} de {data.total_guests} convidados confirmaram.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-label-sm text-label-sm text-on-primary-container">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {formatPercent(data.confirmation_rate)} confirmados
            </span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-l-full bg-primary" style={{ width: confirmationWidth }} />
          </div>
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Confirmados ({data.confirmed_guests})</span>
            <span>Pendentes ({pending})</span>
          </div>
          <div className="flex items-center gap-4 rounded bg-gradient-to-r from-surface-container to-surface-container-low p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
              <Icon name="crib" className="text-[24px]" />
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface italic">Cada confirmação aquece o coração da nossa pequena Catarina.</p>
              <span className="font-label-sm text-label-sm font-semibold tracking-wider text-secondary uppercase">{EVENT.venue} • {EVENT.time}</span>
            </div>
          </div>
        </article>
        <article className="rounded-xl bg-surface-container-lowest p-6 shadow-sm lg:col-span-5 sm:p-8">
          <h2 className="mb-4 font-headline-sm text-headline-sm text-on-surface">Reservas recentes</h2>
          <div className="flex flex-col gap-3">
            {data.recent_reservations.length === 0 ? <p className="font-body-sm text-body-sm text-on-surface-variant">Ainda não há reservas.</p> : null}
            {data.recent_reservations.map((item) => (
              <div key={`${item.guest_name}-${item.gift_name}-${item.reserved_at}`} className="flex items-start gap-3 rounded p-3 hover:bg-surface-container-low">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <Icon name="featured_seasonal_and_gifts" className="text-[18px]" />
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface">
                    <strong>{item.guest_name}</strong> reservou <span className="font-semibold text-secondary">{item.gift_name}</span>.
                  </p>
                  <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                    {formatRelative(item.reserved_at)}
                    {item.message ? ` • “${item.message}”` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function Metric({ icon, label, value, hint }: { icon: string; label: string; value: string; hint: string }) {
  return (
    <article className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-on-surface-variant uppercase">{label}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
          <Icon name={icon} />
        </div>
      </div>
      <p className="my-4 font-display text-display font-semibold text-on-surface">{value}</p>
      <p className="font-label-sm text-label-sm text-on-surface-variant">{hint}</p>
    </article>
  );
}
