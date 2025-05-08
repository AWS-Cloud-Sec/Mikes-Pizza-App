import Image from "next/image";

interface OrderItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetailsProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export default function OrderDetails({
  items,
  subtotal,
  deliveryFee,
  total,
}: OrderDetailsProps) {
  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-medium">
                  {item.quantity} x {item.name}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
