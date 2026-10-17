import React from 'react'
import {
  IoIosArrowRoundForward,
} from "react-icons/io";

export default function StoreBanner() {
  return (
    <section className='mt-5'>
<div className="border rounded-2xl p-6 sm:p-10 bg-[#2C2016] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

<div className="">
    <div className="">
<p className='text-[#C6A27E] text-xs sm:text-sm tracking-widest uppercase font-medium'>New Collection — SS 2026</p>
<h1 className='text-white text-3xl sm:text-4xl mt-3'>Modern Living</h1>
<h1 className='text-[#D6BFA7] text-3xl sm:text-4xl '><i> Collection</i></h1>
<p className='w-full lg:w-[90%] text-sm sm:text-[16px] text-[#9F9A95] mt-4 leading-relaxed'>Timeless furniture crafted for elegant spaces. Designed with intention, built to endure.</p>

<div className="mt-8 flex gap-3">
    <div className="">
      <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-3 rounded-md bg-[#a96f42] px-6 py-3 text-xs sm:text-sm tracking-wider text-white transition hover:bg-[#8e5a35]">
                      Shop Collection
                      <IoIosArrowRoundForward className="text-xl" />
                    </button>
      
            
                  </div>
    </div>

   
</div>
</div>


</div>


<div className="w-full">
    <img src="https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=1200&q=80" alt="over" 
    className='h-[250px] sm:h-[350px] w-full rounded-2xl object-cover' />
</div>





</div>


</section>
  )
}
