import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Save cart to Firestore
  const saveCartToFirestore = useCallback(async (cartItems: CartItem[]) => {
    if (!user) return;
    
    try {
      const cartRef = doc(db, 'carts', user.uid);
      if (cartItems.length === 0) {
        await deleteDoc(cartRef);
      } else {
        await setDoc(cartRef, {
          items: cartItems,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  }, [user]);

  // Load cart from Firestore when user changes
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // If no user, use localStorage
    if (!user) {
      try {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setItems([]);
      }
      setLoading(false);
      return;
    }

    // Subscribe to Firestore cart updates for logged-in users
    setLoading(true);
    const cartRef = doc(db, 'carts', user.uid);
    
    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setItems(data.items || []);
        } else {
          // Check if there's a local cart to migrate
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const localItems = JSON.parse(localCart);
            setItems(localItems);
            // Save local cart to Firestore
            saveCartToFirestore(localItems);
            // Clear local storage
            localStorage.removeItem('cart');
          } else {
            setItems([]);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to cart:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading, saveCartToFirestore]);

  // Save cart when items change (for logged-in users, save to Firestore; for guests, save to localStorage)
  useEffect(() => {
    // Don't save during initial loading
    if (loading || authLoading) return;
    
    if (user) {
      saveCartToFirestore(items);
    } else {
      if (items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(items));
      } else {
        localStorage.removeItem('cart');
      }
    }
  }, [items, user, loading, authLoading, saveCartToFirestore]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (!user) {
      localStorage.removeItem('cart');
    }
    // Firestore will be updated by the useEffect
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
