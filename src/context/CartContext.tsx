import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState(false);

  // Calculate cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Function to fetch latest prices from API
  const fetchLatestPrices = async (
    items: { id: string; size: string; quantity: number }[]
  ) => {
    if (items.length === 0) return [];

    try {
      const response = await axios.get(
        "http://localhost:3000/product/getCartProducts",
        {
          params: {
            items: JSON.stringify(items),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching latest prices:", error);
      throw error;
    }
  };

  // Function to update prices for existing cart items
  const updateCartPrices = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsLoading(true);
      const itemsForApi = cartItems.map((item) => ({
        id: item.id,
        size: item.size,
        quantity: item.quantity,
      }));

      const updatedProducts = await fetchLatestPrices(itemsForApi);

      const updatedCart = cartItems.map((item) => {
        const latestProduct = updatedProducts.find(
          (p: any) => p._id === item.id
        );
        if (latestProduct) {
          return {
            ...item,
            title: latestProduct.title,
            imageUrl: latestProduct.imageUrl,
            price: latestProduct.price, // ✅ Updated price
            totalPrice: latestProduct.price * item.quantity,
          };
        }
        return item;
      });

      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating cart prices", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart and update prices on app start
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        let parsedCart: CartItem[] = JSON.parse(storedCart);

        if (parsedCart.length > 0) {
          setIsLoading(true);
          try {
            const itemsForApi = parsedCart.map((item) => ({
              id: item.id,
              size: item.size,
              quantity: item.quantity,
            }));

            const updatedProducts = await fetchLatestPrices(itemsForApi);

            const updatedCart = parsedCart.map((item) => {
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
            console.error("Error loading cart with updated prices", error);
            setCartItems(parsedCart); // Fallback to stored items
          } finally {
            setIsLoading(false);
          }
        } else {
          setCartItems(parsedCart);
        }
      }
    };

    loadCart();
  }, []);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add items to cart with latest prices
  const addToCart = async (
    productId: string,
    size: string,
    quantity: number = 1
  ) => {
    try {
      setIsLoading(true);

      // Fetch latest product data from API
      const itemsForApi = [{ id: productId, size, quantity }];
      const latestProducts = await fetchLatestPrices(itemsForApi);
      const latestProduct = latestProducts[0];

      if (latestProduct) {
        const newItem: CartItem = {
          id: latestProduct._id,
          title: latestProduct.title,
          size: size,
          price: latestProduct.price, // ✅ Latest price from DB
          quantity: quantity,
          totalPrice: latestProduct.price * quantity,
          imageUrl: latestProduct.imageUrl,
        };

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.id === productId && item.size === size
          );

          if (existingItemIndex > -1) {
            // Update existing item with latest price
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              price: latestProduct.price, // Always use latest price
              totalPrice:
                latestProduct.price *
                (updatedItems[existingItemIndex].quantity + quantity),
            };
            return updatedItems;
          } else {
            // Add new item with latest price
            return [...prevItems, newItem];
          }
        });

        console.log("✅ Added to cart with latest price:", latestProduct.price);
      }
    } catch (error) {
      console.error("❌ Failed to add item to cart with latest price", error);

      // Fallback: Add with available data (you might want to handle this differently)
      const fallbackItem: CartItem = {
        id: productId,
        title: "Product", // You might want to get this from props
        size: size,
        price: 0, // Will be updated later
        quantity: quantity,
        totalPrice: 0,
        imageUrl: "",
      };

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === productId && item.size === size
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          // Keep existing price if update fails
          return updatedItems;
        } else {
          return [...prevItems, fallbackItem];
        }
      });
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
        isLoading,
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
