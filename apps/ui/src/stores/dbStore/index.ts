import { create } from "zustand";

// Everything is any since orbitdb does notn have types defined
export const useDbStore = create<any>((set: any) => ({
  db: undefined,
  dbInstance: undefined,
  setDb: (db: any) => set({ db }),
  setDbInstance: (dbInstance: any) => set({ dbInstance }),
}));
