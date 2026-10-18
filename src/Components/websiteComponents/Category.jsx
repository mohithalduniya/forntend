import { fetchCategory } from "@/api/category";
import React from "react";
import Link from "next/link";

export default async function Category() {
  const response = await fetchCategory({ status: true, limit: 0 });
  const categories = response?.category || [];

  return (
    <>
      <section className="px-5 sm:px-10 lg:px-20 py-8">
        <div className="mb-6">
          <p className="text-[#5E3122] text-sm uppercase tracking-wider font-semibold">
            BROWSE
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-1 text-[#241a14]">
            Shop by Category
          </h2>
        </div>

        {/* image and details section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.map((item, index) => {
            // Check for image from the item object (adjust if your schema is different)
            const imageUrl =
              item.image?.url ||
              item.image ||
              "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=200&h=200&q=80";

            return (
              <Link
                key={item._id || index}
                href={`/store?category=${encodeURIComponent(item.name || "")}`}
                className="group block text-center mt-3 hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                  <img
                    className="w-full h-full object-cover rounded-[50%] border-2 border-transparent transition-all duration-300 group-hover:border-[#5E3122]"
                    src={imageUrl}
                    alt={item.name || "Category"}
                  />
                </div>
                <div className="text-sm sm:text-base font-medium mt-3 text-[#241a14]">
                  <p>{item.name || "Unnamed Category"}</p>
                </div>
                <div className="text-[#6b7280] text-[10px] sm:text-[12px] mt-1">
                  <p>{item.count || 0} Pieces</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
