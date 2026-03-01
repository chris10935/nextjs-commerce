'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'latest-desc' },
  { label: 'Best Selling', value: 'trending-desc' }
];

export default function ProductToolbar({ totalProducts }: { totalProducts: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') ?? '';
  const currentQuery = searchParams.get('q') ?? '';

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: result count + search */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-white">{totalProducts}</span>{' '}
          {totalProducts === 1 ? 'product' : 'products'}
          {currentQuery && (
            <>
              {' '}
              for &quot;<span className="font-medium text-rose-600">{currentQuery}</span>&quot;
            </>
          )}
        </p>
        {isPending && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
        )}
      </div>

      {/* Right: sort dropdown */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="sort-select"
          className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Sort by
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors hover:border-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-rose-600"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
