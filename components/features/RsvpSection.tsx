"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api/client";
import type { ConfirmGuestsResponse, InviteGuestsResponse } from "@/lib/api/types";
import { inviteCodeSchema } from "@/lib/validations/schemas";
import { Icon } from "@/components/ui/Icon";

export function RsvpSection() {
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [fieldError, setFieldError] = useState("");
  const queryClient = useQueryClient();

  const guests = useQuery({
    queryKey: ["public-invite", lookup],
    enabled: lookup.length === 6,
    retry: false,
    queryFn: async () => (await api.get<InviteGuestsResponse>(`/invites/${lookup}/guests/`)).data,
  });

  const confirm = useMutation({
    mutationFn: async () => (await api.post<ConfirmGuestsResponse>(`/invites/${lookup}/confirm_guests/`, { guest_uuids: selected })).data,
    onSuccess: async (data) => {
      setFeedback(data.message || "Presença confirmada.");
      setSelected([]);
      await queryClient.invalidateQueries({ queryKey: ["public-invite", lookup] });
    },
  });

  function searchGuests() {
    const parsed = inviteCodeSchema.safeParse(code);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Código inválido");
      setLookup("");
      return;
    }
    setFieldError("");
    setFeedback("");
    setSelected([]);
    setLookup(parsed.data);
  }

  return (
    <section className="relative w-full bg-surface-container-low/40 py-space-2xl" id="rsvp">
      <div className="mx-auto max-w-[1120px] px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="mx-auto mb-space-xl max-w-2xl text-center">
          <span className="mb-1 flex items-center justify-center gap-1 font-label-md text-label-md font-semibold uppercase tracking-widest text-secondary">
            <Icon name="how_to_reg" className="text-[16px]" />
            Confirmação de presença
          </span>
          <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface">
            Confirme sua <span className="font-semibold text-primary italic">Presença</span>
          </h2>
          <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
            Informe o código de 6 caracteres do seu convite para ver os nomes e confirmar quem vem.
          </p>
        </div>
        <div className="mx-auto max-w-xl rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-13 flex-1 rounded-full bg-surface-container-low px-4 font-headline-sm text-headline-sm tracking-widest text-on-surface uppercase outline-none"
              maxLength={6}
              placeholder="ABC123"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
            />
            <button className="h-13 rounded-full bg-primary px-6 font-label-md text-label-md text-on-primary" type="button" onClick={searchGuests}>
              Buscar convite
            </button>
          </div>
          {fieldError ? <p className="mt-2 font-label-sm text-label-sm text-error">{fieldError}</p> : null}
          {guests.isFetching ? <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">Buscando convidados...</p> : null}
          {guests.isError ? <p className="mt-4 font-body-sm text-body-sm text-error">{getErrorMessage(guests.error, "Não encontramos esse convite.")}</p> : null}
          {guests.data ? (
            <form
              className="mt-6 flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (selected.length === 0) {
                  setFieldError("Selecione ao menos um convidado.");
                  return;
                }
                setFieldError("");
                confirm.mutate();
              }}
            >
              <p className="font-label-md text-label-md text-secondary">Convite de {guests.data.invite.name}</p>
              {guests.data.guests.map((guest) => (
                <label key={guest.uuid} className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3">
                  <span className="flex items-center gap-3">
                    <input
                      checked={selected.includes(guest.uuid)}
                      className="h-4 w-4 accent-primary"
                      disabled={guest.confirmed}
                      type="checkbox"
                      onChange={(event) => {
                        setSelected((current) => (event.target.checked ? [...current, guest.uuid] : current.filter((id) => id !== guest.uuid)));
                      }}
                    />
                    <span className="font-body-md text-body-md text-on-surface">{guest.name}</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{guest.confirmed ? "Já confirmado" : "Pendente"}</span>
                </label>
              ))}
              {guests.data.guests.length === 0 ? <p className="font-body-sm text-body-sm text-on-surface-variant">Este convite ainda não tem convidados.</p> : null}
              <button className="mt-2 flex h-14 items-center justify-center gap-2 rounded-full bg-primary font-label-lg text-label-lg text-on-primary disabled:opacity-70" disabled={confirm.isPending || guests.data.guests.every((guest) => guest.confirmed)} type="submit">
                <Icon name="mark_email_read" />
                {confirm.isPending ? "Confirmando..." : "Confirmar presença"}
              </button>
              {confirm.isError ? <p className="font-body-sm text-body-sm text-error">{getErrorMessage(confirm.error)}</p> : null}
              {feedback ? <p className="rounded-lg bg-primary-fixed/50 px-4 py-3 font-body-sm text-body-sm text-on-primary-fixed">{feedback}</p> : null}
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
