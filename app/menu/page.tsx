"use client";

import { useEffect, useState } from "react";
import MenuItem from "../components/MenuItem";
import Footer from "../components/Footer";
import { getMenu } from "../api/Menu/menuAPI";

const categories = ["All", "Pizza", "Sides", "Drinks", "Desserts"];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const cachedMenu = localStorage.getItem("menu");
    if (cachedMenu) {
      setMenuItems(JSON.parse(cachedMenu));
    } else {
      (async () => {
        const response = await getMenu();
        const menu = response.menu;
        localStorage.setItem("menu", JSON.stringify(menu));
        setMenuItems(menu);
      })();
    }
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-[#0069a7] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        ? "bg-[#0069a7] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Footer />
    </div>
  );
}
