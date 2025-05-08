"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useSearchParams } from 'next/navigation';

interface PizzaCard {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
}

const popularPizzas: PizzaCard[] = [
  {
    id: "home-1",
    name: "Margherita",
    description: "Fresh tomatoes, mozzarella, basil",
    price: 12.99,
    imagePath: "/images/margherita_pizza.jpg",
  },
  {
    id: "home-2",
    name: "Pepperoni",
    description: "Pepperoni, cheese, tomato sauce",
    price: 14.99,
    imagePath: "/images/pep.png",
  },
  {
    id: "home-3",
    name: "BBQ Chicken",
    description: "Chicken, BBQ sauce, onions",
    price: 15.99,
    imagePath: "/images/bbq_pizza.jpg",
  },
  {
    id: "home-4",
    name: "Veggie Supreme",
    description: "Bell peppers, mushrooms, olives",
    price: 13.99,
    imagePath: "/images/veggie_pizza.jpg",
  },
];

function HomeContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const handleAddToCart = (pizza: PizzaCard) => {
    addToCart({
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      image: pizza.imagePath,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Intro Section */}
        <div className="relative min-h-[600px] flex items-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/images/home.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-50 z-10" />

          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                Fresh & Hot Pizza
                <br />
                Delivered to Your
                <br />
                Doorstep
              </h1>
              <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8">
                Order your favorite pizza and get it delivered within 30
                minutes. Fresh ingredients, authentic recipes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://us-east-2yzahmurmt.auth.us-east-2.amazoncognito.com/signup?client_id=9mka5k1capi3rlsv8sfurq13k&redirect_uri=https%3A%2F%2Fmain.d3w16m2ou703w5.amplifyapp.com%2F&response_type=code&scope=email+openid+phone"
                  className="w-full sm:w-auto text-center bg-[#0069a7] text-white px-6 sm:px-8 py-3 rounded hover:bg-[#005286] transition duration-300"
                >
                  Create Account
                </Link>
                <Link
                  href="/menu"
                  className="w-full sm:w-auto text-center bg-white text-gray-900 px-6 sm:px-8 py-3 rounded hover:bg-gray-100 transition duration-300"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#0069a7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Get your pizza delivered within 30 minutes or it's free
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Real-time delivery tracking
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Average delivery time: 25 mins
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Free delivery on orders over $20
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#0069a7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Fresh Ingredients
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    We use only the freshest ingredients for our pizzas
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Daily fresh ingredients delivery
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Organic vegetables and herbs
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Premium quality cheese selection
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#0069a7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Secure Ordering
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Safe and secure payment options for your orders
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Stripe encrypted payment process
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Real-time suspicious activity monitoring
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Secure customer data protection
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Pizzas Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Most Popular Pizzas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {popularPizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  className="bg-white rounded-lg overflow-hidden shadow transform transition duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={pizza.imagePath}
                      alt={pizza.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{pizza.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {pizza.description}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <span className="font-bold text-lg">
                        ${pizza.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(pizza)}
                        className="w-full sm:w-auto bg-[#0069a7] text-white px-4 py-2 rounded hover:bg-[#005286] transition duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
