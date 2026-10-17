import React from "react";
import StoreBanner from "@/Components/websiteComponents/store_Components/StoreBanner";
import Store_Left_Section from "@/Components/websiteComponents/store_Components/Store_Left_Section";
import Store_Right_Section from "@/Components/websiteComponents/store_Components/Store_Right_Section";

export default async function storePage({ searchParams }) {
  const query = await searchParams;

  return (
    <main className="w-full bg-[#F8F5F1] min-h-screen pb-16">
      <StoreBanner />
      <div className="max-w-1500px mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Section */}
          <div className="lg:col-span-3">
            <Store_Left_Section />
          </div>

          {/* Product Grid Section */}
          <div className="lg:col-span-9">
            <Store_Right_Section searchParams={query} />
          </div>
        </div>
      </div>
    </main>
  );
}
