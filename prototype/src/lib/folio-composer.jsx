import React, { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);

export function ComposerProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const openComposer = useCallback((p) => { setPrefill(p || null); setOpen(true); }, []);
  const closeComposer = useCallback(() => setOpen(false), []);
  return <Ctx.Provider value={{ open, prefill, openComposer, closeComposer }}>{children}</Ctx.Provider>;
}

export function useComposer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useComposer must be used within ComposerProvider");
  return c;
}
