import ProductCard from 'components/home/product-card';
import { getProducts } from 'lib/bigcommerce';
import { defaultSort, sorting } from 'lib/constants';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, category } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // When a category is selected, use it as the search query to filter products
  const query = searchValue || category || undefined;
  const products = await getProducts({ sortKey, reverse, query });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-semibold text-neutral-800 dark:text-white">
            &quot;{searchValue}&quot;
          </span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      ) : null}
    </>
  );
}
