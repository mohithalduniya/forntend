import React from "react";
import { TbTruckDelivery, TbRefresh, TbTools, TbShieldCheck } from "react-icons/tb";

export default function Policysection() {
  return (
    <>
      <section className="px-5 sm:px-10 lg:px-20 mt-16 mb-16">
        <div className="border-[#E8E0D5] border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden bg-white shadow-sm">
          <div className="border-b sm:border-b-0 sm:border-r lg:border-b-0 border-[#E8E0D5] p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="flex mb-3 text-3xl sm:text-4xl justify-center text-[#8b5e3c]">
              <TbTruckDelivery />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-medium text-[#241a14]">Free Delivery</p>
              <p className="text-[#6b7280] mt-1 text-xs sm:text-sm">
                On all orders above ₹50,000
              </p>
            </div>
          </div>
          <div className="border-b lg:border-b-0 lg:border-r border-[#E8E0D5] p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="flex mb-3 text-3xl sm:text-4xl justify-center text-[#8b5e3c]">
              <TbRefresh />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-medium text-[#241a14]">30-Day Returns</p>
              <p className="text-[#6b7280] mt-1 text-xs sm:text-sm">
               Hassle-free return policy
              </p>
            </div>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r lg:border-b-0 border-[#E8E0D5] p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="flex mb-3 text-3xl sm:text-4xl justify-center text-[#8b5e3c]">
              <TbTools/>
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-medium text-[#241a14]">Expert Assembly</p>
              <p className="text-[#6b7280] mt-1 text-xs sm:text-sm">
                Professional setup at home
              </p>
            </div>
          </div>

          <div className="p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="flex mb-3 text-3xl sm:text-4xl justify-center text-[#8b5e3c]">
              <TbShieldCheck />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-medium text-[#241a14]">5-Year Warranty</p>
              <p className="text-[#6b7280] mt-1 text-xs sm:text-sm">
                On all furniture items
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
