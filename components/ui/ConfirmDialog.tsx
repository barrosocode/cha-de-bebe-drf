"use client";

import { Icon } from "./Icon";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  pending = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="mb-3 flex items-center gap-2 text-error">
          <Icon name="delete" />
          <h2 id="confirm-title" className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h2>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-full bg-surface-container-high px-5 py-2 font-label-md text-label-md text-on-surface-variant" type="button" onClick={onClose} disabled={pending}>
            Cancelar
          </button>
          <button className="rounded-full bg-error px-5 py-2 font-label-md text-label-md text-on-error disabled:opacity-70" type="button" onClick={onConfirm} disabled={pending}>
            {pending ? "Excluindo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
