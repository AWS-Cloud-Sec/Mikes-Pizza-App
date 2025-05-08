"use client";

export const dynamic = 'force-dynamic';

import { useOrders } from "../context/OrderContext";
import OrderDetails from "../components/OrderDetails";
import OrderHistory from "../components/OrderHistory";
import Footer from "../components/Footer";
import { getOrders } from "../api/Orders/ordersAPI";
interface OrderItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  orderId: string;
  estimatedDelivery: string;
  orderPlaced: string;
  status: "confirmed" | "preparing" | "out-for-delivery" | "delivered";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function TrackOrderPage() {
  const { orders, getCurrentOrder } = useOrders();
  const currentOrder = getCurrentOrder();

  console.log("TrackOrderPage: All orders:", orders);
  console.log("TrackOrderPage: Current order:", currentOrder);

  if (!currentOrder) {
    console.log("TrackOrderPage: No current order found");
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Active Orders
            </h1>
            <p className="text-gray-600">
              You don't have any active orders at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                Order {currentOrder.orderId}
              </p>
              <div className="text-gray-600">
                <p>Estimated Delivery Time:</p>
                <p className="font-semibold text-[#0069a7]">
                  {currentOrder.estimatedDelivery}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 font-medium">Order Placed</p>
              <p className="text-gray-900">{currentOrder.orderPlaced}</p>
            </div>
          </div>

          <OrderDetails
            items={currentOrder.items}
            subtotal={currentOrder.subtotal}
            deliveryFee={currentOrder.deliveryFee}
            total={currentOrder.total}
          />

          <OrderHistory orders={orders} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
