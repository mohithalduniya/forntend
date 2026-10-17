"use client";

import { addTocart } from "@/redux/features/cartsSlice";
import React from "react";
import { useDispatch } from "react-redux";

export default function Add_to_cart ({ className = "", disabled = false , product={} }) {
 const dispture= useDispatch()
  const carthandler= ()=>{
dispture(addTocart({
        name:product.name ,
      thumbnail:product.thumbnail,
      id:product._id,
      price:product.price,
      saleprice:product.salePrice,
      discount:product.discount,
      qty:1,
      shortDescription:product.shortDescription
}))
 }

 


  return (
    <div onClick={carthandler} className="mt-6 flex gap-3">
      <button
        type="button"
        disabled={disabled}
        className={`flex-1 rounded-xl px-6  py-3.5 text-sm font-semibold transition  ${className}`}
      >
        {disabled ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
