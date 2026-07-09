import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Subscriber, Device } from '../types';
import { DEMO_SUBSCRIBER, DEMO_DEVICE } from '../lib/mockData';

interface AppStore {
  subscriber: Subscriber | null;
  isAuthenticated: boolean;
  deviceStatus: Device | null;
  unreadCount: number;
  isDemoMode: boolean;
  paidBillIds: string[];
  setSubscriber: (s: Subscriber) => void;
  updateDeviceStatus: (s: Device) => void;
  setUnreadCount: (n: number) => void;
  setAuthenticated: (val: boolean) => void;
  addPaidBill: (billId: string) => void;
  logout: () => void;
  loadDemoSession: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      subscriber: null,
      isAuthenticated: false,
      deviceStatus: null,
      unreadCount: 2,
      isDemoMode: true,
      paidBillIds: [],

      setSubscriber: (s) => set({ subscriber: s }),
      updateDeviceStatus: (s) => set({ deviceStatus: s }),
      setUnreadCount: (n) => set({ unreadCount: n }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      addPaidBill: (billId) => set((state) => ({ paidBillIds: [...state.paidBillIds, billId] })),
      logout: () => set({ subscriber: null, isAuthenticated: false, deviceStatus: null, paidBillIds: [] }),

      loadDemoSession: () => set({
        subscriber: DEMO_SUBSCRIBER,
        isAuthenticated: true,
        deviceStatus: DEMO_DEVICE,
        unreadCount: 2,
      }),
    }),
    {
      name: 'visiongo-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        subscriber: state.subscriber,
        isAuthenticated: state.isAuthenticated,
        deviceStatus: state.deviceStatus,
        unreadCount: state.unreadCount,
        paidBillIds: state.paidBillIds,
      }),
    }
  )
);
