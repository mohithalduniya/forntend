export default function Arrivals() {
  return (
    <section className="px-5 sm:px-10 lg:px-20 py-8">

      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#5E3122]">
            New Arrivals
          </p>

          <h2 className="text-xl font-normal text-[#241a14]">
            Just Landed
          </h2>
        </div>

        <button className="text-[11px] text-[#8e6040] underline underline-offset-4 transition hover:text-[#5E3122]">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">

        {/* ================= FEATURED PRODUCT ================= */}
        <div className="rounded-2xl bg-[#2c1f17] p-7 text-white md:col-span-6">

          <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-[#c6a27e]">
            Featured
          </p>

          <h3 className=" max-w-62.5 text-2xl font-normal leading-tight">
            Scandinavian
            <br />
            Dining Set
          </h3>

          <p className="mt-3 text-xs text-white/60">
            Ash wood + linen chairs. Set of 4.
          </p>

          <p className="mt-4 text-base">
            ₹1,24,000
          </p>

          <button className="mt-5 rounded-md bg-[#9a633d] px-5 py-2.5 text-[11px] tracking-wide transition hover:bg-[#b1784b]">
            View in Store
          </button>

          {/* Featured Image */}
          <div className="group mt-6 h-37.5overflow-hidden rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80"
              alt="Scandinavian Dining Set"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        
        <div className="flex flex-col gap-4 md:col-span-3">

          {/* Product 1 */}
          <div className="overflow-hidden rounded-2xl border border-[#dfd5ca] bg-white">

            <div className="group h-31.25 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80"
                alt="Linen Wardrobe"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#5d6472]">
                Bedroom
              </p>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs text-[#241a14]">
                  Linen Wardrobe
                </p>

                <p className="whitespace-nowrap text-xs font-medium">
                  ₹1,18,000
                </p>
              </div>

              <div className="mt-2 text-[10px] tracking-widest text-[#c6a27e]">
                ★★★★★
              </div>
            </div>
          </div>

   
          <div className="overflow-hidden rounded-2xl border border-[#dfd5ca] bg-white">

            <div className="group h-31.25 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=700&q=80"
                alt="Walnut TV Console"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#5d6472]">
                Media
              </p>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs text-[#241a14]">
                  Walnut TV Console
                </p>

                <p className="whitespace-nowrap text-xs font-medium">
                  ₹67,000
                </p>
              </div>

              <div className="mt-2 text-[10px] tracking-widest text-[#c6a27e]">
                ★★★★☆
              </div>
            </div>
          </div>

        </div>

     
        <div className="flex flex-col gap-4 md:col-span-3">

          {/* Offer */}
          <div className="min-h-34.75 rounded-2xl border border-[#dfd5ca] bg-[#f5ede3] p-5">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#8e6040]">
              Offer
            </p>

            <h3 className="mt-2 text-sm font-medium text-[#241a14]">
              First order 15% off
            </h3>

            <p className="mt-1 text-[10px] text-[#6b7280]">
              Use code Nestro15 at checkout.
            </p>

            <button className="mt-3 rounded-md bg-[#99623c] px-5 py-2 text-[10px] text-white transition hover:bg-[#7f4f31]">
              Shop Now
            </button>
          </div>

          <div className="min-h-59 rounded-2xl border border-[#dfd5ca] bg-white p-5">

            <p className="text-[9px] uppercase tracking-[0.3em] text-[#5d6472]">
              Free Delivery
            </p>

            <h3 className="mt-3 text-sm font-medium text-[#241a14]">
              On orders above ₹50,000
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[#6b7280]">
              White glove service. Assembly included.
            </p>

          
            <div className="mt-6 text-xl text-[#99623c]">
            
            </div>
          </div>

        </div>
      </div>

      

    </section>
  );
}