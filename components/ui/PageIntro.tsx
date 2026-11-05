"use client";

import { getErrorMessage } from "@/lib/api/client";

export function QueryState({
  isLoading,
  error,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-surface-container-low" />;
  }
  if (error) {
    return <p className="rounded-2xl bg-error-container p-4 font-body-md text-body-md text-on-error-container">{getErrorMessage(error)}</p>;
  }
  return children;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</span>
        <h1 className="mt-1 font-headline-lg text-headline-lg text-on-surface">{title}</h1>
        <p className="mt-1.5 font-body-md text-body-md text-on-surface-variant">{description}</p>
      </div>
      {action}
    </div>
  );
}
