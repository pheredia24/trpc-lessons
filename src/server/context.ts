export async function createContext() {
  // supply per‑request context (e.g. auth info)
  return {} as const;
}

export type Context = Awaited<ReturnType<typeof createContext>>; 