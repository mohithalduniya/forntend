import { fetchproduct } from "@/api/product";
import React from "react";
import Link from "next/link";

export default async function Best_Sellers() {
  const response = await fetchproduct();

  const product = response?.product || [];

  // console.log("Best Sellers Products:", product); 

  return (
    <section className="px-5 py-5 sm:px-10 lg:px-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#5E3122] text-sm">HANDPICKED FOR YOU</p>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            Best Sellers
          </h2>
        </div>

        <div className="text-[12px] sm:text-sm text-[#c6a27e] underline cursor-pointer hover:text-[#5E3122] transition-colors">
          <Link href="/store">View All</Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6 gap-4 sm:gap-6">
        {product.map((item) => (
          <Link
            key={item._id}
            href={`/store?product=${encodeURIComponent(item.name)}`}
            className="group border border-[#c6a27e] rounded-2xl hover:scale-105 transition duration-500 flex flex-col overflow-hidden"
          >
            {/* Image */}
            <div className="w-full h-48 sm:h-56 lg:h-45 overflow-hidden">
              <img
                src={item.thumbnail || "/images/placeholder.jpg"}
                alt={item.name || "Product"}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 grow flex flex-col justify-between">
              <div>
                <div className="text-[#6b7280] text-xs sm:text-sm">
                  <p>{item.categoryId?.name || "Uncategorized"}</p>
                </div>

                <div className="text-sm sm:text-base font-medium mt-1 text-[#333]">
                  <p>{item.name}</p>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center mt-3 text-xs sm:text-sm">
                <div className="text-[#c6a27e] tracking-widest">★★★★★</div>

                <div className="font-semibold text-[#5E3122]">
                  ₹{item.salePrice}
                </div>
              </div>
            </div>
          </Link>
        ))} 
      </div>
    </section>
  );
}
