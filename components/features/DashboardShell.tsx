"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EVENT, LOGO_SRC } from "@/lib/brand";
import { useCurrentUser } from "@/lib/api/queries";
import { useToast } from "@/components/ui/Toast";
import { Icon } from "@/components/ui/Icon";

const groups = [
  {
    label: "Convidados",
    icon: "group",
    links: [
      { href: "/convidados", label: "Listar Convidados" },
      { href: "/convidados/novo", label: "Cadastrar Convidado" },
    ],
  },
  {
    label: "Convites",
    icon: "mark_email_read",
    links: [{ href: "/convites", label: "Listar Convites" }],
  },
  {
    label: "Presentes",
    icon: "card_giftcard",
    links: [
      { href: "/presentes", label: "Listar Presentes" },
      { href: "/presentes/novo", label: "Cadastrar Presente" },
      { href: "/reservados", label: "Presentes Reservados" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href.endsWith("/novo")) return pathname === href;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || (pathname.startsWith(`${href}/`) && !pathname.endsWith("/novo"));
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const displayName = user.data?.first_name || user.data?.username || "Organizador";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.clear();
    window.location.href = "/login";
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.origin);
    toast.success("Link do convite copiado.");
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-4 py-4">
      <Link
        className={`flex items-center gap-3 rounded px-4 py-2.5 font-label-md text-label-md ${isActive(pathname, "/dashboard") ? "bg-primary-container font-semibold text-on-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
        href="/dashboard"
        onClick={() => setOpen(false)}
      >
        <Icon name="grid_view" className="text-[20px]" />
        Visão Geral
      </Link>
      {groups.map((group) => (
        <div key={group.label} className="mt-2">
          <div className="flex items-center gap-1.5 px-4 py-2 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant/80">
            <Icon name={group.icon} className="text-[16px]" />
            {group.label}
          </div>
          <div className="flex flex-col gap-1 pl-4">
            {group.links.map((link) => (
              <Link
                key={link.href}
                className={`rounded px-4 py-2 font-label-md text-label-md ${isActive(pathname, link.href) ? "bg-primary-container font-semibold text-on-primary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface">
      {open ? <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-inverse-surface/30 lg:hidden" type="button" onClick={() => setOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between overflow-y-auto bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          <div className="flex h-20 items-center gap-3 bg-surface-container-lowest/60 px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Monograma Catarina" className="h-8 w-auto object-contain" src={LOGO_SRC} />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm leading-tight text-primary">Catarina</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Gestão & Painel</span>
            </div>
          </div>
          {nav}
        </div>
        <div className="m-4 flex flex-col gap-3 rounded bg-surface-container-lowest/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="person" className="text-[18px]" />
            </div>
            <div>
              <p className="font-label-md text-label-md font-semibold text-on-surface">{displayName}</p>
              <p className="font-label-sm text-label-sm text-secondary">Organizador</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant hover:text-primary" href="/">
              <Icon name="open_in_new" className="text-[16px]" />
              Ver site
            </Link>
            <button className="inline-flex items-center gap-1 font-label-sm text-label-sm text-error" type="button" onClick={logout}>
              <Icon name="logout" className="text-[16px]" />
              Sair
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="fixed top-0 right-0 left-0 z-30 flex h-20 items-center justify-between bg-surface/85 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72 lg:px-6">
          <div className="flex items-center gap-3">
            <button aria-label="Abrir menu" className="rounded-full bg-surface-container-low p-2 lg:hidden" type="button" onClick={() => setOpen(true)}>
              <Icon name="menu" />
            </button>
            <span className="hidden font-headline-sm text-headline-sm text-on-surface sm:inline">Chá de Bebê da Catarina</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full bg-secondary-container px-4 py-2 font-label-sm text-label-sm text-on-secondary-container sm:flex" type="button" onClick={copyLink}>
              <Icon name="content_copy" className="text-[18px]" />
              Copiar link
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-secondary md:flex">
              <Icon name="calendar_today" className="text-[18px]" />
              <span className="font-label-md text-label-md">{EVENT.shortDate}</span>
            </div>
            <Link className="hidden items-center gap-1.5 rounded-full bg-surface-container-lowest px-4 py-2 font-label-sm text-label-sm text-on-surface-variant shadow-sm sm:flex" href="/">
              <Icon name="visibility" className="text-[18px]" />
              Ver site público
            </Link>
          </div>
        </header>
        <main className="min-h-screen px-4 pt-24 pb-10 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
