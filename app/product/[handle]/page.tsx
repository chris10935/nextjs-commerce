import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import Price from 'components/price';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { ProductTabs } from 'components/product/product-tabs';
import { getProduct, getProductRecommendations } from 'lib/bigcommerce';
import { getProductExtras } from 'lib/bigcommerce/product-extras';
import { Image } from 'lib/bigcommerce/types';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import Link from 'next/link';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const extras = getProductExtras(product.id);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={product.images.map((image: Image) => ({
                src: image.url,
                altText: image.altText
              }))}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} extras={extras} />
          </div>
        </div>

        {/* Recommended With */}
        <Suspense>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>

      {/* Tabbed content: Product Details / Texture / Ingredients */}
      <ProductTabs extras={extras} />

      {/* How to Use */}
      {extras.howToUse && (
        <section className="mx-auto mt-12 max-w-screen-2xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">How to Use</h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-8 md:p-12">
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-700">{extras.howToUse}</p>
          </div>
        </section>
      )}

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-10">
      <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-neutral-800">
        Recommended With
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.slice(0, 4).map((product) => {
          const hoverImageUrl =
            product.images?.find((image) => image.url && image.url !== product.featuredImage?.url)
              ?.url ?? undefined;

          return (
            <Link
              key={product.handle}
              href={`${product.handle}`}
              className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-50">
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  hoverSrc={hoverImageUrl}
                  fill
                  sizes="80px"
                />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-neutral-800 group-hover:text-rose-600">
                  {product.title}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {product.description?.slice(0, 60)}…
                </p>
                <Price
                  className="text-sm font-bold text-neutral-900"
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
