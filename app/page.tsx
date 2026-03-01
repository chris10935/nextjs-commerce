import Hero from 'components/home/hero';
import ProductCarousel from 'components/home/product-carousel';
import Footer from 'components/layout/footer';
import { getProducts } from 'lib/bigcommerce';
import { defaultSort, sorting } from 'lib/constants';
import { Suspense } from 'react';

export const runtime = 'edge';

export const metadata = {
  description:
    'AuraGlow — clean, dermatologist-tested skincare formulated for sensitive skin. Gentle ingredients, visible results.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = (searchParams ?? {}) as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const allProducts = await getProducts({ sortKey, reverse, query: searchValue });
  const products = allProducts.slice(0, 6);

  return (
    <>
      <Hero />

      <section id="products" className="mx-auto max-w-screen-2xl px-4 py-10 md:px-6 lg:py-14">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-rose-500" />
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Featured Products
            </h2>
          </div>
        </div>

        <ProductCarousel products={products} />
      </section>

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
