import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CITIES } from "./cities.js";
import { isLocalApproved } from "./api.js";

// Per-device UI state: who is signed in, theme, private saves.
// Shared content (Editions, comments, pitches, gig tips) lives in api.js.
const KEY = "folio_state_v2";

const DEFAULT_STATE = {
  theme: "dark",
  seenIntro: false,
  cityId: "brisbane",     // chosen in the welcome flow; every screen follows it
  session: null,        // { id, email, name, suburb, role, token, local }
  saved: [],            // private bookmarks: { id, title, artist, editionDate }
  feedbackGiven: false,
  demoCurator: false,   // local-mode only: lets the team try the Studio without a database
  demoAdmin: false,     // local-mode only: lets the team try the Admin screen without a database
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {}
  return { ...DEFAULT_STATE };
}

const FolioContext = createContext(null);

export function FolioProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const setSession = useCallback((session) => setState((s) => ({ ...s, session })), []);
  const signOut = useCallback(() => setState((s) => ({ ...s, session: null, demoCurator: false, demoAdmin: false })), []);
  const setTheme = useCallback((theme) => setState((s) => ({ ...s, theme })), []);
  const setCityId = useCallback((cityId) => setState((s) => ({ ...s, cityId: CITIES[cityId] ? cityId : "brisbane" })), []);
  const setSeenIntro = useCallback(() => setState((s) => ({ ...s, seenIntro: true })), []);
  const setFeedbackGiven = useCallback(() => setState((s) => ({ ...s, feedbackGiven: true })), []);
  const setDemoCurator = useCallback((v) => setState((s) => ({ ...s, demoCurator: v })), []);
  const setDemoAdmin = useCallback((v) => setState((s) => ({ ...s, demoAdmin: v })), []);

  const toggleSaved = useCallback((item) => {
    setState((s) => {
      const exists = s.saved.some((x) => x.id === item.id);
      return {
        ...s,
        saved: exists ? s.saved.filter((x) => x.id !== item.id) : [{ ...item, savedAt: Date.now() }, ...s.saved],
      };
    });
  }, []);
  const isSaved = useCallback((id) => state.saved.some((x) => x.id === id), [state.saved]);

  // Curator = approved in the database (remote) or the explicit demo switch (local).
  const isCurator = state.session
    ? state.session.role === "curator" || (state.session.local && (state.demoCurator || isLocalApproved(state.session.id)))
    : false;
  // Folio team = flag in the database (remote) or the explicit demo switch (local).
  const isAdmin = state.session ? Boolean(state.session.isAdmin) || (state.session.local && state.demoAdmin) : false;

  const city = CITIES[state.cityId] || CITIES.brisbane;
  const value = {
    ...state, isCurator, isAdmin, city,
    setSession, signOut, setTheme, setCityId, setSeenIntro, setFeedbackGiven, setDemoCurator, setDemoAdmin,
    toggleSaved, isSaved,
  };
  return <FolioContext.Provider value={value}>{children}</FolioContext.Provider>;
}

export function useFolio() {
  const ctx = useContext(FolioContext);
  if (!ctx) throw new Error("useFolio must be used within FolioProvider");
  return ctx;
}
