// src/context/cartContext.ts
import { createContext } from "react";
import type { CartContextType } from "./cartTypes";

export const CartContext = createContext<CartContextType | null>(null);
