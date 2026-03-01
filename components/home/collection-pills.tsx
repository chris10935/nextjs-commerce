'use client';

import { VercelCollection as Collection } from 'lib/bigcommerce/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CollectionPills({ collections }: { collections: Collection[] }) {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort');

  // Build the base query string (preserve sort if present)
  const qs = currentSort ? `?sort=${currentSort}` : '';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/${qs}`}
        className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-600"
      >
        All
      </Link>
      {collections.map((collection) => (
        <Link
          key={collection.handle}
          href={`/search/${collection.handle}${qs}`}
          className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-rose-600 dark:hover:text-rose-400"
        >
          {collection.title}
        </Link>
      ))}
    </div>
  );
}
