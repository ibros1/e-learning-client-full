// src/context/cartTypes.ts
export interface Course {
  id: number;
  title: string;
  price: number;
  image?: string;
}

export interface CartContextType {
  cartItems: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: number) => void;
}
