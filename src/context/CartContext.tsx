import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useGetCartProducts } from "../customRQHooks/Hooks";

export interface CartItem {
  id: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  addToCart: (
    productId: string,
    size: string,
    quantity?: number
  ) => Promise<void>;
  isLoading: boolean;
  updateCartPrices: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemsForApi, setItemsForApi] = useState<
    { id: string; size: string; quantity: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Use React Query hook
  const {
    data: fetchedProducts,
    isFetching,
    refetch,
  } = useGetCartProducts(itemsForApi, itemsForApi.length > 0);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ✅ Update cart prices using React Query result
  const updateCartPrices = async () => {
    if (cartItems.length === 0) return;
    try {
      setItemsForApi(
        cartItems.map((item) => ({
          id: item.id,
          size: item.size,
          quantity: item.quantity,
        }))
      );

      const result = await refetch(); // manually refetch
      const updatedProducts: any[] = Array.isArray(result.data) ? result.data : [];

      const updatedCart = cartItems.map((item) => {
        const latestProduct = updatedProducts.find(
          (p: any) => p._id === item.id
        );
        if (latestProduct) {
          return {
            ...item,
            title: latestProduct.title,
            imageUrl: latestProduct.imageUrl,
            price: latestProduct.price,
            totalPrice: latestProduct.price * item.quantity,
          };
        }
        return item;
      });

      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating cart prices", error);
    }
  };

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = localStorage.getItem("cartItems");
      if (!storedCart) return;

      const parsedCart: CartItem[] = JSON.parse(storedCart);
      setCartItems(parsedCart);

      if (parsedCart.length > 0) {
        setItemsForApi(
          parsedCart.map((item) => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity,
          }))
        );
      }
    };

    loadCart();
  }, []);

  // ✅ When products fetched, update local cart with new prices
  useEffect(() => {
    if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0 && !isFetching) {
      const updatedCart = cartItems.map((item) => {
        const latestProduct = fetchedProducts.find(
          (p: any) => p._id === item.id
        );
        if (latestProduct) {
          return {
            ...item,
            title: latestProduct.title,
            imageUrl: latestProduct.imageUrl,
            price: latestProduct.price,
            totalPrice: latestProduct.price * item.quantity,
          };
        }
        return item;
      });
      setCartItems(updatedCart);
    }
  }, [fetchedProducts]);

  // ✅ Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add to cart using React Query hook
  const addToCart = async (
    productId: string,
    size: string,
    quantity: number = 1
  ) => {
    try {
      setIsLoading(true);

      const tempItems = [{ id: productId, size, quantity }];
      setItemsForApi(tempItems);

      const result = await refetch();
      const latestProducts = result.data ?? [];
      const latestProduct = latestProducts[0];

      if (latestProduct) {
        const newItem: CartItem = {
          id: latestProduct._id,
          title: latestProduct.title,
          size,
          price: latestProduct.price,
          quantity,
          totalPrice: latestProduct.price * quantity,
          imageUrl: latestProduct.imageUrl,
        };

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.id === productId && item.size === size
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existing = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existing,
              quantity: existing.quantity + quantity,
              price: latestProduct.price,
              totalPrice: latestProduct.price * (existing.quantity + quantity),
            };
            return updatedItems;
          } else {
            return [...prevItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        addToCart,
        isLoading: isLoading || isFetching,
        updateCartPrices,
      }}
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
