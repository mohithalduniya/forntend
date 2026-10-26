"use client";

import { addTocart } from "@/redux/features/cartsSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    const markdownUrl = image.match(/\((https?:\/\/[^)]+)\)/);
    return markdownUrl ? markdownUrl[1] : image;
  }
  if (typeof image === "object") {
    return image.url || image.secure_url || image.image || image.path || image.src || "";
  }
  return "";
};

export default function Add_to_cart({
  className = "",
  disabled = false,
  product = {},
}) {
  const dispatch = useDispatch();

  const carthandler = (e) => {
    e.stopPropagation();
    if (disabled) return;

    if (!product || (!product._id && !product.id && !product.name)) {
      toast.error("Product details unavailable");
      return;
    }

    const resolvedThumbnail =
      getImageUrl(product.thumbnail) ||
      getImageUrl(Array.isArray(product.images) ? product.images[0] : null) ||
      "";

    const regularPrice = Number(product.price) || 0;
    const salePrice =
      Number(product.salePrice ?? product.saleprice ?? product.price) || regularPrice;
    const productId = String(product._id || product.id || "");

    dispatch(
      addTocart({
        id: productId,
        _id: productId,
        name: product.name || "Product",
        thumbnail: resolvedThumbnail,
        price: regularPrice,
        salePrice: salePrice,
        saleprice: salePrice,
        discount: Number(product.discount) || 0,
        qty: 1,
        shortDescription: product.shortDescription || "",
      })
    );

    toast.success(`"${product.name || "Product"}" added to cart!`);
  };

  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={carthandler}
        disabled={disabled}
        className={`flex-1 rounded-xl px-6 py-3.5 text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed ${className}`}
      >
        {disabled ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
