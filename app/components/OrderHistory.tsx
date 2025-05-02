import { Order } from '../context/OrderContext';

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {orders.map((order) => (
          <div key={order.orderId} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium text-gray-900">Order {order.orderId}</p>
                <p className="text-sm text-gray-500">Placed on {order.orderPlaced}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.status}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span>{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 