"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface OrderItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderId: string;
  estimatedDelivery: string;
  orderPlaced: string;
  status: 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  getCurrentOrder: () => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      console.log('OrderProvider: Loading orders from localStorage...');
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('OrderProvider: Found saved orders:', parsedOrders);
        setOrders(parsedOrders);
      } else {
        console.log('OrderProvider: No saved orders found');
      }
    } catch (error) {
      console.error('OrderProvider: Error loading orders:', error);
    }
  }, []);

  const addOrder = async (order: Order) => {
    try {
      console.log('OrderProvider: Adding new order:', order);
      const newOrders = [order, ...orders];
      console.log('OrderProvider: Saving orders to localStorage:', newOrders);
      localStorage.setItem('orders', JSON.stringify(newOrders));
      setOrders(newOrders);
    } catch (error) {
      console.error('OrderProvider: Error adding order:', error);
      throw error;
    }
  };

  const getCurrentOrder = () => {
    console.log('OrderProvider: Getting current order from:', orders);
    return orders[0];
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
} 