import { create } from 'zustand';

interface UiState {
  showSuperUserInfo: boolean;
  setShowSuperUserInfo: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  showSuperUserInfo: false,
  setShowSuperUserInfo: (show) => set({ showSuperUserInfo: show }),
}));