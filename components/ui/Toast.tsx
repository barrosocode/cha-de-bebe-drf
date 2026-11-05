"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Tone = "success" | "error";

type ToastItem = { id: number; message: string; tone: Tone };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: Tone) => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,24rem)] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`rounded-lg px-4 py-3 font-body-sm text-body-sm shadow-lg ${
              item.tone === "error" ? "bg-error-container text-on-error-container" : "bg-surface-container-lowest text-on-surface"
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ficar dentro de ToastProvider");
  return context;
}
