/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Clear cart when user changes/logs out
  useEffect(() => {
    if (!user) {
      setCart([]);
      setQuantities({});
    }
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    const price = product.srp ?? product.price ?? 0;
    const cartItem = {
      ...product,
      name: product.productName || product.name,
      price,
      quantity,
      subtotal: price * quantity
    };
    
    setCart(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * price }
            : item
        );
      }
      return [...prev, cartItem];
    });
    
    setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    return true;
  };

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[productId];
      return newQuantities;
    });
  };

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      quantities,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
