import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const KEY = "folio_state_v1";

const DEFAULT_STATE = {
  onboarded: false,
  theme: "dark",
  communities: [],
  profile: {
    name: "You",
    username: "",
    bio: "",
    avatar: "https://i.pravatar.cc/300?img=68",
    verification: "not_verified",
  },
  // Merged: your own unfinished work AND bookmarks of others' posts live
  // in one bucket now — no separate Draft/Saved distinction.
  saved: [],
  posts: [],
  feedbackGiven: false,
  // Likes & comments — one shared engine, keyed by any target id
  // (a post id or a Thread id), used identically in both places.
  interactions: {},
  // The curator's staged, editable-until-11:30pm Thread
  pendingThread: null,
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

  const setCommunities = useCallback((ids) => {
    setState((s) => ({ ...s, communities: ids.slice(0, 3), onboarded: true }));
  }, []);

  const updateProfile = useCallback((patch) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  // Unified save — used both for "save this unfinished post" from the
  // composer, and "bookmark someone else's post" from a PostCard.
  const saveItem = useCallback((item) => {
    setState((s) => {
      const exists = s.saved.find((x) => x.id === item.id);
      if (exists) return s; // already saved, no duplicate
      return {
        ...s,
        saved: [{ ...item, id: item.id || "s" + Date.now(), savedAt: Date.now() }, ...s.saved],
      };
    });
  }, []);

  const removeSaved = useCallback((id) => {
    setState((s) => ({ ...s, saved: s.saved.filter((x) => x.id !== id) }));
  }, []);

  const isSaved = useCallback((id) => state.saved.some((x) => x.id === id), [state.saved]);

  const publishPost = useCallback((post) => {
    setState((s) => ({
      ...s,
      posts: [{ ...post, type: "Post", id: "p" + Date.now(), date: new Date().toISOString().slice(5, 10).replace("-", "/").toUpperCase(), likes: 0 }, ...s.posts],
    }));
  }, []);

  const setFeedbackGiven = useCallback(() => {
    setState((s) => ({ ...s, feedbackGiven: true }));
  }, []);

  const setTheme = useCallback((t) => {
    setState((s) => ({ ...s, theme: t }));
  }, []);

  // ── Likes & comments — single implementation, works for a post id
  // or a Thread id identically ──
  const toggleLike = useCallback((id, baseLikes = 0) => {
    setState((s) => {
      const current = s.interactions[id] || { likes: baseLikes, likedByMe: false, comments: [] };
      const likedByMe = !current.likedByMe;
      return {
        ...s,
        interactions: {
          ...s.interactions,
          [id]: { ...current, likedByMe, likes: current.likes + (likedByMe ? 1 : -1) },
        },
      };
    });
  }, []);

  const addComment = useCallback((id, text) => {
    setState((s) => {
      const current = s.interactions[id] || { likes: 0, likedByMe: false, comments: [] };
      const comment = { id: "c" + Date.now(), author: "You", text, date: new Date().toISOString().slice(5, 10) };
      return {
        ...s,
        interactions: {
          ...s.interactions,
          [id]: { ...current, comments: [...current.comments, comment] },
        },
      };
    });
  }, []);

  const getInteractions = useCallback((id, baseLikes = 0) => {
    return state.interactions[id] || { likes: baseLikes, likedByMe: false, comments: [] };
  }, [state.interactions]);

  // ── Curator staging ──
  const setPendingThread = useCallback((thread) => {
    setState((s) => ({ ...s, pendingThread: thread }));
  }, []);
  const clearPendingThread = useCallback(() => {
    setState((s) => ({ ...s, pendingThread: null }));
  }, []);

  const value = {
    ...state, setCommunities, updateProfile, saveItem, removeSaved, isSaved,
    publishPost, setFeedbackGiven, setTheme,
    toggleLike, addComment, getInteractions,
    setPendingThread, clearPendingThread,
  };
  return <FolioContext.Provider value={value}>{children}</FolioContext.Provider>;
}

export function useFolio() {
  const ctx = useContext(FolioContext);
  if (!ctx) throw new Error("useFolio must be used within FolioProvider");
  return ctx;
}
