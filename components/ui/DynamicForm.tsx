"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm, type DefaultValues, type FieldErrors, type FieldValues, type Path, type Resolver, type UseFormSetError } from "react-hook-form";
import type { ZodTypeAny } from "zod";
import { maskPhone } from "@/lib/format";
import { Icon } from "./Icon";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "select" | "phone" | "tags" | "readonly";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  readOnlyValue?: string;
};

const inputClass =
  "w-full rounded bg-surface-container-low px-4 font-body-md text-body-md text-on-surface outline-none ring-primary-container placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2";

function errorOf(errors: FieldErrors, name: string) {
  const error = errors[name];
  if (error && typeof error.message === "string") return error.message;
  return undefined;
}

export function DynamicForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  submitLabel,
  cancelHref,
  title,
  description,
  eyebrow,
  breadcrumbs,
  onSubmit,
  aside,
  banner,
}: {
  schema: ZodTypeAny;
  defaultValues: DefaultValues<T>;
  fields: FormField[];
  submitLabel: string;
  cancelHref: string;
  title: string;
  description: string;
  eyebrow: string;
  breadcrumbs: { label: string; href?: string }[];
  onSubmit: (values: T, setError: UseFormSetError<T>) => Promise<void>;
  aside?: React.ReactNode;
  banner?: React.ReactNode;
}) {
  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues,
  });

  const signature = JSON.stringify(defaultValues);
  useEffect(() => {
    form.reset(defaultValues);
    // The serialized defaults are the reset trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const rootMessage = form.formState.errors.root?.message;

  return (
    <form
      className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values, form.setError);
      })}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <span className="text-outline-variant">/</span> : null}
                {crumb.href ? (
                  <Link className="hover:text-primary" href={crumb.href}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-primary">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-2 font-label-sm text-label-sm font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
          <h1 className="mt-1 font-headline-lg text-headline-lg text-primary">{title}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-full bg-surface-container-high px-6 py-2.5 font-label-md text-label-md text-on-surface-variant" href={cancelHref}>
            Cancelar
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-2.5 font-label-md text-label-md text-on-primary shadow-[0_8px_24px_rgba(216,164,169,0.35)] disabled:opacity-70"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            <Icon name="favorite" className="text-[18px]" />
            {form.formState.isSubmitting ? "Salvando..." : submitLabel}
          </button>
        </div>
      </div>

      {banner}
      {typeof rootMessage === "string" ? <p className="rounded-lg bg-error-container px-4 py-3 font-body-sm text-body-sm text-on-error-container">{rootMessage}</p> : null}

      <div className={`grid grid-cols-1 gap-6 ${aside ? "lg:grid-cols-12" : ""}`}>
        <div className={`flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm ${aside ? "lg:col-span-8" : ""}`}>
          {fields.map((field) => {
            const message = errorOf(form.formState.errors, field.name);
            return (
              <label key={field.name} className="flex flex-col gap-1.5">
                <span className="font-label-md text-label-md font-medium text-on-surface">
                  {field.label}
                  {field.required ? <span className="text-primary"> *</span> : null}
                </span>
                {field.type === "readonly" ? (
                  <input className={`${inputClass} h-13`} readOnly value={field.readOnlyValue ?? ""} />
                ) : null}
                {field.type === "textarea" ? (
                  <textarea className={`${inputClass} min-h-28 py-3`} placeholder={field.placeholder} {...form.register(field.name as Path<T>)} />
                ) : null}
                {field.type === "text" || field.type === "url" ? (
                  <input className={`${inputClass} h-13`} placeholder={field.placeholder} type={field.type === "url" ? "url" : "text"} {...form.register(field.name as Path<T>)} />
                ) : null}
                {field.type === "number" ? (
                  <input className={`${inputClass} h-13`} min={1} step={1} type="number" {...form.register(field.name as Path<T>, { valueAsNumber: true })} />
                ) : null}
                {field.type === "select" ? (
                  <select className={`${inputClass} h-13`} {...form.register(field.name as Path<T>)}>
                    <option value="">{field.placeholder ?? "Selecione"}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
                {field.type === "phone" ? (
                  <Controller
                    control={form.control}
                    name={field.name as Path<T>}
                    render={({ field: controlled }) => (
                      <input
                        autoComplete="off"
                        className={`${inputClass} h-13`}
                        inputMode="numeric"
                        placeholder="(99) 9 9999-9999"
                        value={controlled.value ?? ""}
                        onChange={(event) => controlled.onChange(maskPhone(event.target.value))}
                      />
                    )}
                  />
                ) : null}
                {field.type === "tags" ? (
                  <Controller
                    control={form.control}
                    name={field.name as Path<T>}
                    render={({ field: controlled }) => (
                      <TagInput
                        placeholder={field.placeholder}
                        value={Array.isArray(controlled.value) ? (controlled.value as string[]) : []}
                        onChange={controlled.onChange}
                      />
                    )}
                  />
                ) : null}
                {field.hint ? <span className="font-label-sm text-label-sm text-on-surface-variant">{field.hint}</span> : null}
                {message ? <span className="font-label-sm text-label-sm text-error">{message}</span> : null}
              </label>
            );
          })}
        </div>
        {aside ? <div className="lg:col-span-4">{aside}</div> : null}
      </div>
    </form>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (value: string[]) => void; placeholder?: string }) {
  function addFrom(raw: string) {
    const next = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => !value.some((current) => current.toLowerCase() === item.toLowerCase()));
    if (next.length) onChange([...value, ...next]);
  }

  return (
    <div className={`${inputClass} flex min-h-13 flex-wrap items-center gap-2 py-2`}>
      {value.map((tag) => (
        <button
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 font-label-sm text-label-sm text-on-primary-fixed"
          type="button"
          onClick={() => onChange(value.filter((item) => item !== tag))}
        >
          {tag}
          <Icon name="close" className="text-[14px]" />
        </button>
      ))}
      <input
        className="min-w-40 flex-1 bg-transparent outline-none"
        placeholder={placeholder ?? "Digite e pressione Enter"}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const target = event.currentTarget;
            addFrom(target.value);
            target.value = "";
          }
        }}
        onBlur={(event) => {
          addFrom(event.currentTarget.value);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
