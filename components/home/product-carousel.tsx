'use client';

import { VercelProduct as Product } from 'lib/bigcommerce/types';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../price';

function CarouselCard({ product }: { product: Product }) {
  const hoverImageUrl =
    product.images?.find((img) => img.url && img.url !== product.featuredImage?.url)?.url ??
    undefined;

  return (
    <Link href={product.handle} className="group block w-[280px] flex-shrink-0 sm:w-[300px]">
      {/* Image wrapper */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 group-hover:border-rose-300 group-hover:shadow-lg group-hover:shadow-rose-100/50 dark:border-neutral-800 dark:bg-neutral-900 dark:group-hover:border-rose-600 dark:group-hover:shadow-rose-900/20">
        {product.featuredImage?.url ? (
          <>
            <Image
              src={product.featuredImage.url}
              alt={product.title}
              fill
              sizes="300px"
              className={`object-contain p-4 transition-all duration-500 group-hover:scale-105 ${
                hoverImageUrl ? 'opacity-100 group-hover:opacity-0' : ''
              }`}
            />
            {hoverImageUrl ? (
              <Image
                src={hoverImageUrl}
                alt={`${product.title} - alternate view`}
                fill
                sizes="300px"
                className="object-contain p-4 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300 dark:text-neutral-700">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Quick-look hover overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/5 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:from-black/20">
          <span className="block rounded-lg bg-white/90 py-2 text-center text-xs font-semibold text-neutral-800 backdrop-blur-sm dark:bg-neutral-900/90 dark:text-white">
            View Product
          </span>
        </div>

        {/* Sold out badge */}
        {!product.availableForSale && (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Sold Out
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1 px-1">
        <h3 className="truncate text-sm font-semibold text-neutral-800 transition-colors group-hover:text-rose-600 dark:text-neutral-200 dark:group-hover:text-rose-400">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <Price
            className="text-sm font-bold text-neutral-900 dark:text-white"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          {product.priceRange.minVariantPrice.amount !==
            product.priceRange.maxVariantPrice.amount && (
            <span className="text-xs text-neutral-400">
              from{' '}
              <Price
                className="inline text-xs text-neutral-400"
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
              />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  // Duplicate the list so the scroll loops seamlessly
  const items = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white sm:w-20 dark:from-neutral-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white sm:w-20 dark:from-neutral-950" />

      <div className="group/carousel animate-scroll flex w-max gap-6 hover:[animation-play-state:paused]">
        {items.map((product, i) => (
          <CarouselCard key={`${product.handle}-${i}`} product={product} />
        ))}
      </div>
    </div>
  );
}
