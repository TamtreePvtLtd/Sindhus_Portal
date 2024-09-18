import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // Load cart items from local storage on initial render
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }

    // Load cart count from local storage
    const storedCartCount = localStorage.getItem("cartCount");
    if (storedCartCount) {
      setCartCount(Number(storedCartCount));
    }

    // Clear local storage on page refresh
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartCount");
    });

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartCount");
      });
    };
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    // Save cart count to local storage whenever cartCount changes
    localStorage.setItem("cartCount", String(cartCount));
  }, [cartCount]);

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, cartCount, setCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
