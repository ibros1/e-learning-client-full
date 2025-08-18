import { useState, type ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { Course } from "./cartTypes";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<Course[]>([]);

  const addToCart = (course: Course) => {
    if (!cartItems.find((item) => item.id === course.id)) {
      setCartItems([...cartItems, course]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Halkan ku dar useCart hook-ka
