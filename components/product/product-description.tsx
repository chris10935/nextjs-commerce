import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import type { ProductExtra } from 'lib/bigcommerce/product-extras';
import { VercelProduct as Product } from 'lib/bigcommerce/types';
import { VariantSelector } from './variant-selector';

/* ---- Badge icon helper ---- */
function BadgeIcon({ icon }: { icon: string }) {
  if (icon === 'vegan')
    return (
      <svg
        className="mx-auto mb-1 h-8 w-8 text-neutral-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    );
  if (icon === 'ewg')
    return (
      <svg
        className="mx-auto mb-1 h-8 w-8 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    );
  // fragrance-free
  return (
    <svg
      className="mx-auto mb-1 h-8 w-8 text-neutral-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
}

export function ProductDescription({
  product,
  extras
}: {
  product: Product;
  extras?: ProductExtra;
}) {
  const hasComparePrice =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

  return (
    <div className="flex flex-col gap-6">
      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-neutral-900 md:text-3xl">
          {product.title}
        </h1>
        {extras?.subtitle && <p className="mt-1 text-sm text-neutral-500">{extras.subtitle}</p>}
      </div>

      {/* "What it is" description */}
      {product.description && (
        <div className="rounded-md border border-amber-200/60 bg-amber-50/60 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            What it is
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">{product.description}</p>
        </div>
      )}

      {/* Key Ingredients */}
      {extras?.keyIngredients && extras.keyIngredients.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-neutral-800">
            Key Ingredients
          </h3>
          <ul className="space-y-1">
            {extras.keyIngredients.map((ing) => (
              <li key={ing.name} className="text-sm text-neutral-600">
                <span className="font-medium text-neutral-800">{ing.name}</span>
                {ing.description && <span className="text-neutral-500"> — {ing.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Variant selector */}
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-neutral-800">Variants</p>
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <Price
          className="text-xl font-bold text-neutral-900"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
        {hasComparePrice && (
          <>
            <Price
              className="text-base text-neutral-400 line-through"
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
            <span className="rounded bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
              Sale
            </span>
          </>
        )}
      </div>

      {/* Add to Cart */}
      <AddToCart variants={product.variants} availableForSale={product.availableForSale} />

      {/* Trust badges */}
      {extras?.badges && extras.badges.length > 0 && (
        <div className="flex items-start justify-center gap-8 border-t border-neutral-200 pt-6">
          {extras.badges.map((badge) => (
            <div key={badge.label} className="flex max-w-[100px] flex-col items-center text-center">
              <BadgeIcon icon={badge.icon} />
              <span className="text-[11px] leading-tight text-neutral-600">{badge.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
