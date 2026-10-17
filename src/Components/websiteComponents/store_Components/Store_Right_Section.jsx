import React from "react";
import { fetchproduct } from "@/api/product";
import {
  IoIosArrowRoundForward,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import Product_card from "./product_card";

export default async function Store_Right_Section({ searchParams }) {
  const params = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });
  }
  const queryString = params.toString();


  const storeLists = await fetchproduct({ queryString });

  const products = storeLists?.product || [];

  return (
    <section className="space-y-6">
      {/* Top Controls Bar */}
      <div className="border border-[#D6BFA7] rounded-xl bg-white flex flex-wrap justify-between items-center p-4 gap-4 shadow-sm">
        <div className="text-sm font-medium">
          128 <span className="text-[#6b7280] font-normal">Products found</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 border-none rounded-lg text-xs px-3 py-1.5 text-[#8B5E3C] bg-[#F5EDE4] font-medium">
            Living Room <button className="hover:text-black">×</button>
          </span>
          <span className="inline-flex items-center gap-1.5 border-none rounded-lg text-xs px-3 py-1.5 text-[#8B5E3C] bg-[#F5EDE4] font-medium">
            Solid Wood <button className="hover:text-black">×</button>
          </span>

          <select className="bg-[#FAFAF9] border border-[#D6BFA7] p-1.5 rounded-lg text-xs focus:outline-none ">
            <option value="featured">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}

      <Product_card product={products} />

      {/* Banner */}
      <div className="border border-[#D6BFA7] rounded-xl flex flex-wrap justify-between items-center p-6 bg-[#2C2016] gap-4">
        <div>
          <p className="text-[#D6BFA7] text-xs font-medium uppercase tracking-wider">
            Limited Time Offer
          </p>
          <p className="text-white text-base md:text-lg font-medium mt-1">
            Free White Glove Delivery on orders above ₹75,000
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#a96f42] px-5 py-2.5 text-xs text-white transition hover:bg-[#8e5a35] font-medium">
          Shop Now <IoIosArrowRoundForward className="text-xl" />
        </button>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 justify-center items-center pt-2">
        <button className="p-2 border border-[#D6BFA7] hover:border-[#a96f42] rounded-lg text-sm bg-white">
          <IoIosArrowBack />
        </button>
        <button className="px-3.5 py-1.5 border border-[#a96f42] bg-[#a96f42] text-white rounded-lg text-xs font-medium">
          1
        </button>
        <button className="px-3.5 py-1.5 border border-[#D6BFA7] hover:border-[#a96f42] rounded-lg text-xs bg-white">
          2
        </button>
        <button className="px-3.5 py-1.5 border border-[#D6BFA7] hover:border-[#a96f42] rounded-lg text-xs bg-white">
          3
        </button>
        <span className="px-2 text-xs text-gray-400">...</span>
        <button className="px-3.5 py-1.5 border border-[#D6BFA7] hover:border-[#a96f42] rounded-lg text-xs bg-white">
          8
        </button>
        <button className="p-2 border border-[#D6BFA7] hover:border-[#a96f42] rounded-lg text-sm bg-white">
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}
