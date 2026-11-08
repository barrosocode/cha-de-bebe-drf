"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DUE_DATE, EVENT, HERO_IMAGE, PUBLIC_LOGO_SRC } from "@/lib/brand";
import { Icon } from "@/components/ui/Icon";
import { GiftCatalog } from "./GiftCatalog";
import { RsvpSection } from "./RsvpSection";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function timeUntil(target: Date, now: number) {
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function HomePage() {
  const [now, setNow] = useState(() => Date.now());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const eventCountdown = timeUntil(EVENT.date, now);
  const dueCountdown = timeUntil(DUE_DATE, now);

  return (
    <div className="bg-surface">
      <header className="fixed top-0 right-0 left-0 z-50 bg-surface/85 shadow-[0_1px_8px_rgba(216,164,169,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1120px] items-center justify-between px-margin md:px-margin-tablet lg:px-margin-desktop">
          <a className="flex items-center gap-3" href="#convite">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Emblema Catarina" className="h-8 w-auto object-contain" src={PUBLIC_LOGO_SRC} />
            <span className="font-headline-sm text-headline-sm font-medium text-primary">Catarina</span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full bg-surface-container-low/70 p-1 md:flex">
            <a className="rounded-full bg-primary-container px-4 py-1 font-semibold text-on-primary-container" href="#convite">Convite</a>
            <a className="rounded-full px-4 py-1 font-label-md text-label-md text-on-surface-variant" href="#rsvp">Confirmar presença</a>
            <a className="rounded-full px-4 py-1 font-label-md text-label-md text-on-surface-variant" href="#presentes">Lista de Presentes</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link aria-label="Área dos pais" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary" href="/login">
              <Icon name="person" className="text-[18px]" />
            </Link>
            <button aria-label="Abrir menu" className="md:hidden" type="button" onClick={() => setMenuOpen((value) => !value)}>
              <Icon name="menu" />
            </button>
          </div>
        </div>
        {menuOpen ? (
          <div className="flex flex-col gap-2 px-margin pb-4 md:hidden">
            <a href="#convite" onClick={() => setMenuOpen(false)}>Convite</a>
            <a href="#rsvp" onClick={() => setMenuOpen(false)}>Confirmar presença</a>
            <a href="#presentes" onClick={() => setMenuOpen(false)}>Lista de Presentes</a>
          </div>
        ) : null}
      </header>
      <main className="pt-20">
        <section className="relative overflow-x-clip pb-space-2xl" id="convite">
          <div className="pointer-events-none absolute top-0 left-1/2 h-[380px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-container/25 via-secondary-fixed/20 to-transparent blur-3xl" />
          <div className="relative z-10 mx-auto max-w-[1120px] px-margin pt-space-xl md:px-margin-tablet lg:px-margin-desktop">
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-high/70 px-4 py-1 font-label-md text-label-md tracking-wider text-secondary uppercase">
                <Icon name="favorite" className="text-[15px]" filled />
                Uma Nova Vida Floresce • Convite Especial
              </span>
            </div>
            <div className="mx-auto mb-space-xl max-w-3xl text-center">
              <h1 className="mb-3 font-display text-display-mobile text-on-surface md:text-display">
                Chá de Bebê da nossa <br className="hidden sm:inline" />
                <span className="font-normal text-primary italic">doce Catarina</span>
              </h1>
              <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                Estamos ansiosos para compartilhar esse momento tão especial com você. Preparamos uma tarde de sorrisos, bênçãos e memórias para celebrar a chegada do amor das nossas vidas.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-label-lg text-label-lg text-on-primary shadow-md" href="#rsvp">
                  <Icon name="mark_email_read" />
                  Confirmar presença
                </a>
                <a className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-6 py-3 font-label-lg text-label-lg text-secondary shadow-sm" href="#presentes">
                  <Icon name="card_giftcard" />
                  Ver Lista de Mimos
                </a>
              </div>
            </div>
            <div className="mb-space-xl grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
              <div className="relative min-h-[360px] overflow-hidden rounded-xl bg-surface-container-low shadow-sm lg:col-span-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Decoração floral do chá" className="absolute inset-0 h-full w-full object-cover" src={HERO_IMAGE} />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/75 via-inverse-surface/20 to-transparent" />
                <div className="relative z-10 flex h-full items-end p-6 text-on-primary">
                  <p className="font-headline-sm text-headline-sm">Família, amigos e um cafezinho com bolo</p>
                </div>
              </div>
              <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-sm md:p-8 lg:col-span-5">
                <span className="font-label-sm text-label-sm font-semibold tracking-widest text-secondary uppercase">Detalhes Importantes</span>
                <div className="mt-4 space-y-4">
                  <Detail icon="calendar_month" label="Data Marcada" value={EVENT.dateLabel} />
                  <Detail icon="schedule" label="Horário de Recepção" value={EVENT.time} />
                  <Detail icon="location_on" label="Local do Encontro" value={EVENT.venue} extra={EVENT.address} />
                </div>
              </div>
              <div className="flex min-h-[320px] flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-sm lg:col-span-3">
                <iframe
                  allowFullScreen
                  className="min-h-0 w-full flex-1 border-0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={EVENT.mapsEmbedUrl}
                  title="Mapa do local do chá"
                />
                <a className="flex items-center justify-center gap-1 px-4 py-3 font-label-sm text-label-sm font-semibold text-primary" href={EVENT.mapsUrl} rel="noreferrer" target="_blank">
                  <Icon name="pin_drop" className="text-[15px]" />
                  Abrir no mapa
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-surface-container-low p-6 shadow-sm md:flex-row md:p-8">
              <div className="text-center md:text-left">
                <span className="flex items-center justify-center gap-1 font-label-sm text-label-sm font-semibold tracking-widest text-secondary uppercase md:justify-start">
                  <Icon name="celebration" className="text-[16px]" />
                  Contagem regressiva para o chá
                </span>
                <h2 className="mt-1 font-headline-lg text-headline-lg text-primary">Faltam poucos dias para nos abraçarmos</h2>
              </div>
              <div className="flex items-center gap-2 text-center sm:gap-4">
                <TimeBox label="Dias" value={pad(eventCountdown.days)} />
                <TimeBox label="Horas" value={pad(eventCountdown.hours)} />
                <TimeBox label="Min" value={pad(eventCountdown.minutes)} />
                <TimeBox label="Seg" value={pad(eventCountdown.seconds)} />
              </div>
            </div>
          </div>
        </section>
        <RsvpSection />
        <GiftCatalog />
      </main>
      <footer className="bg-surface-container-low">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center px-margin py-space-2xl text-center md:px-margin-desktop">
          <span className="mb-2 font-display text-display-mobile text-primary italic">Esperando Catarina</span>
          <p className="font-label-sm text-label-sm tracking-widest text-secondary uppercase">24/02/2027</p>
          <div className="mt-4 flex items-center gap-2 text-center sm:gap-4">
            <TimeBox label="Dias" value={pad(dueCountdown.days)} />
            <TimeBox label="Horas" value={pad(dueCountdown.hours)} />
            <TimeBox label="Min" value={pad(dueCountdown.minutes)} />
            <TimeBox label="Seg" value={pad(dueCountdown.seconds)} />
          </div>
          <p className="mt-6 max-w-md font-body-md text-body-md text-on-surface-variant">Cada detalhe foi preparado com carinho para comemorar o início desta jornada com a nossa pequena.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 font-label-md text-label-md text-on-surface-variant">
            <a href="#convite">O Convite</a>
            <a href="#rsvp">Confirmação de Presença</a>
            <a href="#presentes">Lista de Presentes</a>
          </div>
          <p className="mt-6 font-body-sm text-body-sm text-outline">© 2025 Chá de Bebê da Catarina • Celebrado com afeto e carinho familiar.</p>
        </div>
      </footer>
    </div>
  );
}

function Detail({ icon, label, value, extra }: { icon: string; label: string; value: string; extra?: string }) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-surface-container-low/60 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
        <Icon name={icon} className="text-on-primary-container" />
      </div>
      <div>
        <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</span>
        <span className="font-headline-sm text-headline-sm text-on-surface">{value}</span>
        {extra ? <p className="font-body-sm text-body-sm text-on-surface-variant">{extra}</p> : null}
      </div>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[70px] flex-col items-center rounded-lg bg-surface-container-lowest px-4 py-2 shadow-sm">
      <span className="font-display-mobile text-display-mobile leading-none font-semibold text-primary">{value}</span>
      <span className="mt-1 font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</span>
    </div>
  );
}
