import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchproductById } from "@/api/product";
import Add_to_cart from "@/Components/websiteComponents/Add_to_cart";
import Best_Sellers from "@/Components/websiteComponents/Best_Sellers";

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

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

const getCategoryName = (category) => {
  if (!category) return "Furniture";

  if (typeof category === "string") {
    return category;
  }

  return category.name || category.title || category.slug || "Furniture";
};

const getWeight = (weight) => {
  if (!weight) return "N/A";

  if (typeof weight === "string" || typeof weight === "number") {
    return String(weight);
  }

  if (typeof weight === "object") {
    const value = weight.value ?? weight.weight;

    const unit = weight.unit || "";

    if (value !== undefined && value !== null) {
      return `${value}${unit ? ` ${unit}` : ""}`;
    }

    return unit || "N/A";
  }

  return "N/A";
};

const getDimensions = (dimensions) => {
  if (!dimensions) return "N/A";

  if (typeof dimensions === "string" || typeof dimensions === "number") {
    return String(dimensions);
  }

  if (typeof dimensions !== "object") {
    return "N/A";
  }

  const unit = dimensions.unit || "";

  const length = dimensions.length ?? dimensions.l;

  const width = dimensions.width ?? dimensions.w;

  const height = dimensions.height ?? dimensions.h;

  const values = [length, width, height].filter(
    (value) => value !== undefined && value !== null && value !== "",
  );

  if (values.length) {
    return `${values.join(" × ")}${unit ? ` ${unit}` : ""}`;
  }

  return unit || "N/A";
};

const getColors = (value) => {
  if (!value) return "N/A";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return (
      value
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (typeof item === "object") {
            return item.name || item.value || item.color || "";
          }

          return "";
        })
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  }

  if (typeof value === "object") {
    return value.name || value.value || value.color || "N/A";
  }

  return "N/A";
};

export default async function ProductPage({ params }) {
  const { products_viewe_id } = await params;

  const response = await fetchproductById(products_viewe_id);

  if (!response?.success) {
    notFound();
  }

  const product = response?.product || response?.data;

  if (!product) {
    notFound();
  }

  const productImages = Array.isArray(product.images)
    ? product.images.map(getImageUrl).filter(Boolean)
    : [];

  const thumbnail = getImageUrl(product.thumbnail);

  const images = [
    ...productImages,
    ...(thumbnail && !productImages.includes(thumbnail) ? [thumbnail] : []),
  ];

  const mainImage = images[0] || "";

  const price = Number(product.price);

  const salePrice = Number(product.salePrice);

  const hasSale =
    !Number.isNaN(price) &&
    !Number.isNaN(salePrice) &&
    salePrice > 0 &&
    salePrice !== price;

  const category = getCategoryName(product.categoryId?.name);

  const colors = getColors(product.colors || product.color);

  const weight = getWeight(product.weight);

  const dimensions = getDimensions(product.dimensions);

  return (
    <main className="min-h-screen bg-[#FCFAF8]">
      {/* Breadcrumb */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/store" className="transition hover:text-[#8B5E3C]">
            Store
          </Link>

          <span>/</span>

          <span className="truncate text-[#2C2016]">{product.name}</span>
        </div>
      </div>

      {/* Product */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* =====================
              Images
          ===================== */}

          <div>
            <div className="overflow-hidden rounded-2xl bg-[#F5F0EB]">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name || "Product"}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden rounded-xl border-2 ${
                      index === 0 ? "border-[#8B5E3C]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =====================
              Product Info
          ===================== */}

          <div className="flex flex-col justify-center">
            {/* Category */}

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B08A63]">
              {category}
            </p>

            {/* Name */}

            <h1 className=" text-3xl font-semibold leading-tight text-[#2C2016] sm:text-4xl">
              {product.name}
            </h1>

            {/* Description */}

            {product.shortDescription && (
              <p className="mt-1 text-sm leading-7 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}

            <div className="mt-2 border-y border-[#E8DDD2] py-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-[#2C2016]">
                  {formatPrice(hasSale ? product.salePrice : product.price)}
                </span>

                {hasSale && (
                  <span className="mb-1 text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {hasSale && product.discount && (
                <p className="mt-1 text-xs font-semibold text-green-600">
                  {product.discount}% OFF
                </p>
              )}
            </div>

            {/* Stock */}

            <div className="mt-1">
              {product.stock ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* CTA */}

<div className=" grid grid-cols-2 gap-2">
            <Add_to_cart
              className={`${
                product.stock
                  ? "bg-[#2C2016] text-white hover:bg-[#8B5E3C]"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            />
            <div>
              <button
                type="button"
                className="mt-5 rounded-xl border border-[#2C2016] px-5 py-3.5 text-xl text-[#2C2016] transition hover:bg-[#F5EDE4]"
                aria-label="Add to wishlist"
              >
                ♡
              </button>
            </div>
            </div>

            {/* Product Information */}

            <div className="mt-4 rounded-2xl border border-[#E8DDD2] bg-white p-5">
              <h2 className="text-sm font-semibold text-[#2C2016]">
                Product Information
              </h2>

              <div className="mt-3 divide-y divide-[#F1E8DE]">
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Material</span>

                  <span className="text-right font-medium text-[#2C2016]">
                    {product.material || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Color</span>

                  <span className="text-right font-medium text-[#2C2016]">
                    {colors}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Weight</span>

                  <span className="text-right font-medium text-[#2C2016]">
                    {weight}
                  </span>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-gray-500">Dimensions</span>

                  <span className="text-right font-medium text-[#2C2016]">
                    {dimensions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}

      {product.description && (
        <section className="border-t border-[#E8DDD2] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B08A63]">
                Product Details
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#2C2016]">
                About this product
              </h2>

              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-600">
                {product.description}
              </p>
            </div>
          </div>

          <div className="">
            <Best_Sellers/>
          </div>
        </section>
      )}

      {/* Back */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/store"
          className="text-sm font-semibold text-[#8B5E3C] transition hover:text-[#2C2016]"
        >
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
}
