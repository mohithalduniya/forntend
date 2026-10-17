"use client";

import React from "react";
import Link from "next/link";
import Add_to_cart from "../Add_to_cart";

/* =========================
   IMAGE URL
========================= */

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    const markdownUrl = image.match(/\((https?:\/\/[^)]+)\)/);

    return markdownUrl ? markdownUrl[1] : image;
  }

  if (typeof image === "object") {
    return (
      image.url ||
      image.secure_url ||
      image.image ||
      image.path ||
      image.src ||
      ""
    );
  }

  return "";
};

/* =========================
   CATEGORY NAME
========================= */

const getCategoryName = (category) => {
  if (!category) return "Furniture";

  if (typeof category === "string") {
    return category;
  }

  if (typeof category === "object") {
    return category.name || category.title || category.slug || "Furniture";
  }

  return "Furniture";
};

/* =========================
   PRODUCT CARD
========================= */

export default function Product_card({ product = [] }) {
  const products = Array.isArray(product) ? product : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        /* =========================
           PRODUCT ID
        ========================= */

        const productId = item._id || item.slug;

        /* =========================
           IMAGE
        ========================= */

        const images = Array.isArray(item.images) ? item.images : [];

        const firstImage = getImageUrl(images[0]);
        const thumbnail = getImageUrl(item.thumbnail);

        const imageUrl = firstImage || thumbnail;

        /* =========================
           CATEGORY
        ========================= */

        const category = getCategoryName(item.categoryId);

        /* =========================
           PRICE
        ========================= */

        const price = Number(item.price);
        const salePrice = Number(item.salePrice);

        const hasSale =
          Number.isFinite(price) &&
          Number.isFinite(salePrice) &&
          price > 0 &&
          salePrice > 0 &&
          salePrice < price;

        /* =========================
           DISCOUNT
        ========================= */

        const discount = hasSale
          ? Math.round(((price - salePrice) / price) * 100)
          : 0;

        /* =========================
           STOCK
        ========================= */

        const inStock = Boolean(item.stock);

        /* =========================
           PRODUCT NAME
        ========================= */

        const productName = item.name || "Unnamed Product";

        return (
          <article
            key={productId}
            className="
              group
              flex
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-[#d8b38c]
              bg-white
              transition-all
              duration-500
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            {/* =========================
                IMAGE
            ========================= */}

            <Link href={`/store/${productId}`}>
              <div
                className="
                  relative
                  h-44
                  sm:h-48
                  lg:h-48
                  overflow-hidden
                  bg-[#f9e9e4]
                "
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={productName}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-sm
                      text-gray-400
                    "
                  >
                    No image available
                  </div>
                )}

                {/* =========================
                    DISCOUNT
                ========================= */}

                {hasSale && (
                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      rounded-full
                      bg-[#2C2016]
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-white
                    "
                  >
                    {discount}% OFF
                  </span>
                )}

                {/* =========================
                    OUT OF STOCK
                ========================= */}

                {!inStock && (
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/25
                    "
                  >
                    <span
                      className="
                        rounded-full
                        bg-white
                        px-3
                        py-1.5
                        text-[10px]
                        font-semibold
                        text-[#2C2016]
                      "
                    >
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* =========================
                CONTENT
            ========================= */}

            <div
              className="
                flex
                flex-1
                flex-col
                p-3
                sm:p-4
              "
            >
              {/* =========================
                  CATEGORY
              ========================= */}

              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-widest
                  text-[#A17D5A]
                "
              >
                {category}
              </p>

              {/* =========================
                  PRODUCT NAME
              ========================= */}

              <Link href={`/store/${productId}`}>
                <h3
                  className="
                    mt-1
                    line-clamp-1
                    text-base
                    font-semibold
                    text-[#2C2016]
                    transition-colors
                    hover:text-[#8B5E3C]
                  "
                >
                  {productName}
                </h3>
              </Link>

              {/* =========================
                  DESCRIPTION
              ========================= */}

              {item.shortDescription && (
                <p
                  className="
                    mt-1
                    line-clamp-1
                    text-xs
                    leading-5
                    text-[#81766D]
                  "
                >
                  {item.shortDescription}
                </p>
              )}

              {/* =========================
                  PRICE
              ========================= */}

              <div className="mt-3 flex items-center gap-2">
                {hasSale && (
                  <span
                    className="
                      text-xs
                      text-[#9CA3AF]
                      line-through
                    "
                  >
                    ₹{price}
                  </span>
                )}

                <span
                  className="
                    text-lg
                    font-bold
                    text-[#5E3122]
                  "
                >
                  ₹{hasSale ? salePrice : price}
                </span>
              </div>

              {/* =========================
                  ADD TO CART
              ========================= */}

              <div className="">
                {inStock ? (
                  <Add_to_cart
                    product={item}
                    className="
                      w-full
                      rounded-xl
                      bg-[#2C2016]
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#5E3122]
                    "
                  />
                ) : (
                  <button
                    disabled
                    className="
                      w-full
                      cursor-not-allowed
                      rounded-xl
                      bg-gray-200
                      py-2.5
                      text-sm
                      font-semibold
                      text-gray-400
                    "
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
