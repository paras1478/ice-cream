import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: {
    _id: string;
    name: string;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i._id === item._id);

        if (!existingItem) {
          set({
            items: [...get().items, item],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item._id !== id),
        });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item._id === id);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
