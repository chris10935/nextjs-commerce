import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ProductCard from 'components/home/product-card';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { ProductTabs } from 'components/product/product-tabs';
import { getProduct, getProductRecommendations, getProducts } from 'lib/bigcommerce';
import { getProductExtras } from 'lib/bigcommerce/product-extras';
import { Image } from 'lib/bigcommerce/types';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';

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

        {/* Related Products */}
        <Suspense>
          <RelatedProducts id={product.id} handle={product.handle} />
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

async function RelatedProducts({ id, handle }: { id: string; handle: string }) {
  // Try Shopify recommendations first, fall back to all products
  let relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) {
    const allProducts = await getProducts({});
    // Exclude the current product
    relatedProducts = allProducts.filter((p) => p.handle !== handle);
  }

  if (!relatedProducts.length) return null;

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-rose-500" />
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          You May Also Like
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
    </div>
  );
}
