import React from "react";

import Slideshow from "@/Components/websiteComponents/Slideshow";
import Category from "@/Components/websiteComponents/Category";
import Best_Sellers from "@/Components/websiteComponents/Best_Sellers";
import Arrivals from "@/Components/websiteComponents/Arrivals";
import ShopRoom from "@/Components/websiteComponents/ShopRoom";
import OurCraft from "@/Components/websiteComponents/OurCraft";
import ReviewSection from "@/Components/websiteComponents/ReviewSection";
import Policysection from "@/Components/websiteComponents/Policysection";

export default function page() {
  return (
    <>
      <main className=" mx-auto bg-[#fef9f3] scroll-smooth ">
        <Slideshow />
        <Category />
        <Best_Sellers />
        <Arrivals />
        <ShopRoom />
        <OurCraft />
        <Policysection />
        <ReviewSection />
      </main>
    </>
  );
}
