import { create } from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  postLoginAction: string | null;
  setPostLoginAction: (action: string | null) => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  postLoginAction: null,
  setPostLoginAction: (action) => set({ postLoginAction: action }),
}));
