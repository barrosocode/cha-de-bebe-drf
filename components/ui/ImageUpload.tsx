"use client";

import { useEffect, useMemo } from "react";
import { Icon } from "./Icon";

export function ImageUpload({
  file,
  existingUrl,
  onChange,
}: {
  file: File | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
}) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const src = preview || existingUrl;

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Fotografia do item</h2>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">A imagem é enviada junto com o presente depois que os dados são salvos.</p>
      <div className="relative mt-4 h-56 overflow-hidden rounded-lg bg-surface-container-low">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="Prévia do presente" className="h-full w-full object-cover" src={src} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-on-surface-variant">
            <Icon name="add_a_photo" className="text-[28px]" />
            <span className="font-label-md text-label-md">Nenhuma imagem selecionada</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 font-label-md text-label-md text-on-primary">
          <Icon name="upload" className="text-[18px]" />
          Escolher imagem
          <input
            accept="image/*"
            className="sr-only"
            type="file"
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
        </label>
        {file ? (
          <button className="rounded-full bg-surface-container-high px-4 py-2 font-label-md text-label-md text-on-surface-variant" type="button" onClick={() => onChange(null)}>
            Remover seleção
          </button>
        ) : null}
      </div>
    </section>
  );
}
