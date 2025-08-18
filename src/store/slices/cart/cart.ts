import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  course_img: string;
}

interface CartState {
  items: CartItem[];
}

let persistedItems: CartItem[] = [];

try {
  const raw = localStorage.getItem("cartItems");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      persistedItems = parsed;
    } else {
      // If parsed is not an array, ignore or reset localStorage here
      localStorage.removeItem("cartItems");
    }
  }
} catch (err) {
  // If JSON.parse fails, clear corrupted localStorage
  console.error(err);
  localStorage.removeItem("cartItems");
}

const initialState: CartState = {
  items: persistedItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) {
        // only add if not already in cart
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
