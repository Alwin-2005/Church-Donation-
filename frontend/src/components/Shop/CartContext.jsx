import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Fetch cart from backend on mount or user change
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]); // Clear cart if logged out
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/users/cart/view");
      if (data && data.items) {
        const formattedCart = data.items.map(item => ({
          id: item.itemId._id,
          qty: item.quantity,
          ...item.itemId // include other merch details
        }));
        setCart(formattedCart);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const updateCart = async (product, qty) => {
    const productId = product.id || product._id;

    // Update local state first for responsiveness
    setCart(prev => {
      const existing = prev.find(i => i.id === productId);
      if (existing) {
        if (qty <= 0) return prev.filter(i => i.id !== productId);
        return prev.map(i => i.id === productId ? { ...i, qty } : i);
      }
      return [...prev, { ...product, id: productId, qty }];
    });

    // Sync with backend if logged in
    if (user) {
      try {
        const existingItem = cart.find(i => i.id === productId);
        if (qty <= 0) {
          // Remove from backend
          await api.patch("/cart/update", { itemId: productId, quantity: 0 });
        } else if (existingItem) {
          // Update quantity in backend
          await api.patch("/cart/update", { itemId: productId, quantity: qty });
        } else {
          // Add to backend
          await api.post("/cart/add", { itemId: productId, quantity: qty, price: product.price });
        }
      } catch (err) {
        console.error("Failed to sync cart with backend:", err);
      }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="w-full">
      <CartContext.Provider value={{ cart, updateCart, clearCart }}>
        {children}
      </CartContext.Provider>
    </div>
  );
};

export const useCart = () => useContext(CartContext);
