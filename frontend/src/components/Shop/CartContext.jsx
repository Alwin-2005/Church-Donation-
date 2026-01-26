import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const updateCart = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);

      if (existing) {
        if (qty === 0) {
          return prev.filter(i => i.id !== product.id);
        }
        return prev.map(i =>
          i.id === product.id ? { ...i, qty } : i
        );
      }

      return [...prev, { ...product, qty }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
