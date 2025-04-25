"use client";

import constants from "constants";
// Manages shopping cart current state
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Properties of each item in cart
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

// What functions and data the cart provides
interface CartContextType {
  cartItems: CartItem[]; // List of items in cart
  addToCart: (item: Omit<CartItem, "quantity">) => void; // Add new item to cart
  removeFromCart: (id: string) => void; // Remove item from cart
  updateQuantity: (id: string, quantity: number) => void; // Change how many of an item
  getTotalItems: () => number; // Count total items in cart
  clearCart: () => void; // Empty the cart
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart functionality
export function CartProvider({ children }: { children: ReactNode }) {
  // Store cart items in state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      setCartItems(JSON.parse(localCart));
    }
  }, []);

  // Add item to cart or increase quantity if already in cart
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // If item exists, just increase its quantity
        var updatedItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // If new item, add it with quantity 1
      updatedItems = [...prevItems, { ...item, quantity: 1 }];
      sessionStorage.setItem("cart", JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Change how many of an item is in the cart
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      // If quantity is 0 or less, remove the item
      removeFromCart(id);
      return;
    }
    // Update the quantity of the item
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Count total number of items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Empty the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Provide cart functions and data to the app
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart functions in components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
