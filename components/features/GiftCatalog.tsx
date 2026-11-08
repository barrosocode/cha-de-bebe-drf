"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api/client";
import { useGifts } from "@/lib/api/queries";
import type { Gift, GiftPurchaseResponse, InviteGuestsResponse } from "@/lib/api/types";
import { inviteCodeSchema } from "@/lib/validations/schemas";
import { Icon } from "@/components/ui/Icon";

export function GiftCatalog() {
  const gifts = useGifts();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");
  const [selected, setSelected] = useState<Gift | null>(null);
  const [details, setDetails] = useState<Gift | null>(null);

  const tags = useMemo(() => {
    const names = new Set<string>();
    gifts.data?.forEach((gift) => gift.tags.forEach((item) => names.add(item.name)));
    return ["all", ...Array.from(names)];
  }, [gifts.data]);

  const visible = (gifts.data ?? []).filter((gift) => {
    const query = search.trim().toLowerCase();
    const haystack = `${gift.name} ${gift.description} ${gift.tags.map((item) => item.name).join(" ")}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesTag = tag === "all" || gift.tags.some((item) => item.name === tag);
    return matchesQuery && matchesTag;
  });

  return (
    <section className="w-full py-space-2xl" id="presentes">
      <div className="mx-auto max-w-[1120px] px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="mb-space-lg text-center">
          <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface">
            Lista de Presentes da <span className="font-semibold text-primary italic">Catarina</span>
          </h2>
          <p className="mx-auto mt-space-xs max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Escolha um mimo com o código do convite. A reserva fica registrada no nome de um convidado daquele convite.
          </p>
        </div>
        <div className="mb-space-md">
          <div className="relative">
            <Icon name="search" className="absolute top-1/2 left-4 -translate-y-1/2 text-outline" />
            <input
              className="h-12 w-full rounded-lg bg-surface-container-low pr-4 pl-12 font-body-md text-body-md text-on-surface outline-none"
              placeholder="Buscar presente por nome ou etiqueta"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-1.5 font-label-md text-label-md ${tag === item ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}
                type="button"
                onClick={() => setTag(item)}
              >
                {item === "all" ? "Todos" : item}
              </button>
            ))}
          </div>
        </div>
        {gifts.isLoading ? <p className="font-body-md text-body-md text-on-surface-variant">Carregando a lista...</p> : null}
        {gifts.isError ? <p className="rounded-lg bg-error-container p-4 text-on-error-container">{getErrorMessage(gifts.error)}</p> : null}
        <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((gift) => {
            const image = gift.files.find((file) => file.image_url)?.image_url;
            return (
              <article key={gift.uuid} className="flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                <div>
                  <div className="relative h-56 bg-surface-container-low">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={gift.name} className="h-full w-full object-cover" src={image} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary">
                        <Icon name="card_giftcard" className="text-[40px]" />
                      </div>
                    )}
                    {gift.tags[0] ? <span className="absolute top-3 left-3 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-label-sm font-semibold text-secondary uppercase">{gift.tags[0].name}</span> : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{gift.name}</h3>
                    <p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{gift.description || "Um carinho escolhido para a Catarina."}</p>
                    <p className="mt-3 font-label-sm text-label-sm text-on-surface-variant">Até {gift.limit} {gift.limit === 1 ? "escolha" : "escolhas"}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4 pt-0">
                  <button className="flex w-full items-center justify-center gap-1.5 rounded-full border border-outline-variant py-2.5 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low" type="button" onClick={() => setDetails(gift)}>
                    Ver detalhes
                  </button>
                  <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-surface-container-low py-2.5 font-label-md text-label-md text-primary hover:bg-primary hover:text-on-primary" type="button" onClick={() => setSelected(gift)}>
                    <Icon name="favorite" className="text-[18px]" />
                    Presentear Catarina
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {gifts.data && visible.length === 0 ? <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">Nenhum presente encontrado.</p> : null}
      </div>
      {details ? (
        <GiftDetailsModal
          gift={details}
          onClose={() => setDetails(null)}
          onPresent={() => {
            setDetails(null);
            setSelected(details);
          }}
        />
      ) : null}
      {selected ? <PurchaseModal gift={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  );
}

function GiftDetailsModal({ gift, onClose, onPresent }: { gift: Gift; onClose: () => void; onPresent: () => void }) {
  const image = gift.files.find((file) => file.image_url)?.image_url;
  const description = gift.description || "Um carinho escolhido para a Catarina.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-container-lowest shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-64 bg-surface-container-low">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={gift.name} className="h-full w-full object-cover" src={image} />
          ) : (
            <div className="flex h-full items-center justify-center text-primary">
              <Icon name="card_giftcard" className="text-[48px]" />
            </div>
          )}
          <button aria-label="Fechar" className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <h3 id="gift-details-title" className="font-headline-sm text-headline-sm text-on-surface">
            {gift.name}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
          {gift.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {gift.tags.map((item) => (
                <span key={item.uuid} className="rounded-full bg-surface-container-low px-3 py-1 font-label-sm text-label-sm text-secondary">
                  {item.name}
                </span>
              ))}
            </div>
          ) : null}
          {gift.link ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nesse link você encontra o presente num preço legal{" "}
              <a className="break-all font-semibold text-primary underline" href={gift.link} target="_blank" rel="noopener noreferrer">
                {gift.link}
              </a>
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 font-label-md text-label-md text-on-primary" type="button" onClick={onPresent}>
              <Icon name="favorite" className="text-[18px]" />
              Presentear Catarina
            </button>
            <button className="flex-1 rounded-full bg-surface-container-high py-2.5 font-label-md text-label-md text-on-surface-variant" type="button" onClick={onClose}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchaseModal({ gift, onClose }: { gift: Gift; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState("");
  const [guest, setGuest] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [done, setDone] = useState("");

  const guests = useQuery({
    queryKey: ["purchase-guests", lookup],
    enabled: lookup.length === 6,
    retry: false,
    queryFn: async () => (await api.get<InviteGuestsResponse>(`/invites/${lookup}/guests/`)).data,
  });

  const purchase = useMutation({
    mutationFn: async () =>
      (
        await api.post<GiftPurchaseResponse>(`/gifts/${gift.uuid}/purchase/`, {
          code: lookup,
          guest,
          message,
        })
      ).data,
    onSuccess: (data) => setDone(data.message || "Presente registrado com carinho."),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-container-lowest p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{gift.name}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Informe o código do convite e quem está presenteando.</p>
          </div>
          <button aria-label="Fechar" type="button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {done ? (
          <p className="rounded-lg bg-primary-fixed/60 p-4 font-body-md text-body-md text-on-primary-fixed">{done}</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input className="h-12 flex-1 rounded-full bg-surface-container-low px-4 uppercase outline-none" maxLength={6} placeholder="Código" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
              <button
                className="rounded-full bg-primary px-4 font-label-md text-label-md text-on-primary"
                type="button"
                onClick={() => {
                  const parsed = inviteCodeSchema.safeParse(code);
                  if (!parsed.success) {
                    setFieldError(parsed.error.issues[0]?.message ?? "Código inválido");
                    return;
                  }
                  setFieldError("");
                  setGuest("");
                  setLookup(parsed.data);
                }}
              >
                Buscar
              </button>
            </div>
            {guests.isError ? <p className="font-body-sm text-body-sm text-error">{getErrorMessage(guests.error, "Convite não encontrado.")}</p> : null}
            {guests.data ? (
              <select className="h-12 rounded bg-surface-container-low px-4 outline-none" value={guest} onChange={(event) => setGuest(event.target.value)}>
                <option value="">Quem está presenteando?</option>
                {guests.data.guests.map((item) => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : null}
            <textarea className="min-h-24 rounded bg-surface-container-low p-4 outline-none" placeholder="Uma mensagem carinhosa (opcional)" value={message} onChange={(event) => setMessage(event.target.value)} />
            {fieldError ? <p className="font-label-sm text-label-sm text-error">{fieldError}</p> : null}
            {purchase.isError ? <p className="font-body-sm text-body-sm text-error">{getErrorMessage(purchase.error)}</p> : null}
            <button
              className="h-12 rounded-full bg-primary font-label-md text-label-md text-on-primary disabled:opacity-70"
              disabled={purchase.isPending || !guest}
              type="button"
              onClick={() => purchase.mutate()}
            >
              {purchase.isPending ? "Registrando..." : "Confirmar escolha"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
