import React from "react";

export default function ReviewSection() {
  return (
    <section className="px-5 sm:px-10 lg:px-20 mt-16">
      <div className="mb-6">
        <p className="text-[#5E3122] text-[12px] uppercase tracking-wider font-semibold">
          What our customers say
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold mt-1">Loved by 12,000+ homes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
        <div className="border border-[#e8e0d5] px-6 py-5 rounded-2xl bg-[#ffffff] shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#c6a27e] mb-3 text-lg">★★★★★</div>
          <p className="text-sm text-[#4b4f58] mb-6 leading-relaxed">
            <i>
              "The Ember Velvet sofa is absolutely stunning. Delivery was
              flawless and the quality is beyond what I expected."
            </i>
          </p>
          <div className="flex gap-3 items-center mt-auto">
            <div className="">
              <p className=" border-[#f0ebe3] border w-10 h-10 flex items-center justify-center rounded-full bg-[#f0ebe3] text-[#5E3122] text-sm font-medium ">
                PR
              </p>
            </div>
            <div className="">
              <p className="text-[14px] font-medium text-[#241a14]">Priya Rao</p>
              <p className="text-[12px] text-[#6b7280]">Mumbai</p>
            </div>
          </div>
        </div>

        <div className="border border-[#e8e0d5] px-6 py-5 rounded-2xl bg-[#ffffff] shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#c6a27e] mb-3 text-lg">★★★★★</div>
          <p className="text-sm text-[#4b4f58] mb-6 leading-relaxed">
            <i>
              "Nestro transformed our living room. Every piece feels like it
              belongs — timeless and beautifully crafted."
            </i>
          </p>
          <div className="flex gap-3 items-center mt-auto">
            <div className="">
              <p className=" border-[#f0ebe3] border w-10 h-10 flex items-center justify-center rounded-full bg-[#f0ebe3] text-[#5E3122] text-sm font-medium ">
                AS
              </p>
            </div>
            <div className="">
              <p className="text-[14px] font-medium text-[#241a14]">Arjun Sharma</p>
              <p className="text-[12px] text-[#6b7280]">Bangalore</p>
            </div>
          </div>
        </div>

        <div className="border border-[#e8e0d5] px-6 py-5 rounded-2xl bg-[#ffffff] shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[#c6a27e] mb-3 text-lg">★★★★★</div>
          <p className="text-sm text-[#4b4f58] mb-6 leading-relaxed">
            <i>
              "Premium quality at a fair price. The travertine side table is a
              conversation starter every time."
            </i>
          </p>
          <div className="flex gap-3 items-center mt-auto">
            <div className="">
              <p className=" border-[#f0ebe3] border w-10 h-10 flex items-center justify-center rounded-full bg-[#f0ebe3] text-[#5E3122] text-sm font-medium ">
                NK
              </p>
            </div>
            <div className="">
              <p className="text-[14px] font-medium text-[#241a14]">Neha Kapoor</p>
              <p className="text-[12px] text-[#6b7280]">Delhi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#171008] rounded-2xl mt-12 mb-10 px-6 sm:px-10 py-10 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <p className="uppercase tracking-widest text-[11px] text-[#C6A27E] mb-3 font-semibold">
              Stay in the loop
            </p>
            <h2 className="text-[#FAF7F4] text-2xl sm:text-3xl font-medium mb-3">
              Design tips & new arrivals
            </h2>
            <p className="text-[#817C77] text-sm sm:text-base">
              Join 8,000 subscribers who get exclusive first looks.
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col w-full lg:w-auto items-start lg:items-end">
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full sm:w-64 bg-[#29231D] border border-[#4A4138] sm:border-r-0 sm:rounded-r-none rounded-md sm:rounded-l-md px-5 py-3.5 text-[13px] text-white outline-none focus:border-[#95613C] transition-colors placeholder:text-[#817C77]"
              />

              <button
                className="bg-[#95613C] text-white text-[13px] font-medium px-6 py-3.5 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-[#A97048] transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>

            <p className="text-[#817C77] text-[11px] mt-4 lg:mt-3 self-start lg:self-end">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
