"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "./icons";

// Saved buses live in this browser only; there are no accounts yet.
const KEY = "favourite-buses";
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default function FavouriteButton({ busId, name, small }: { busId: string; name: string; small?: boolean }) {
  const saved = useSyncExternalStore(
    subscribe,
    () => read().includes(busId),
    () => false,
  );

  const toggle = () => {
    const ids = read().filter((id) => id !== busId);
    try {
      localStorage.setItem(KEY, JSON.stringify(saved ? ids : [...ids, busId]));
    } catch {
      // Storage blocked (private mode); the heart just won't stay filled.
    }
    listeners.forEach((l) => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className={`flex shrink-0 items-center justify-center rounded-full border transition ${
        small ? "h-9 w-9 shadow-md" : "h-11 w-11"
      } ${
        saved
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-slate-200 bg-white text-primary-600 hover:border-primary-500"
      }`}
    >
      <HeartIcon className={small ? "h-4 w-4" : "h-5 w-5"} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
