'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const categories = [
  { title: 'All Products', slug: '' },
  { title: 'Serums', slug: 'serum' },
  { title: 'Creams & Moisturizers', slug: 'cream' },
  { title: 'Cleansers', slug: 'cleanser' },
  { title: 'Exfoliators', slug: 'exfoliating' },
  { title: 'Acne Care', slug: 'acne' },
  { title: 'Sunscreen & SPF', slug: 'sunscreen' },
  { title: 'Masks', slug: 'mask' },
  { title: 'Toners', slug: 'toner' }
];

function CategoryItem({ title, slug }: { title: string; slug: string }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const active = currentCategory === slug;

  // Preserve sort param when switching categories
  const params = new URLSearchParams();
  const sort = searchParams.get('sort');
  if (sort) params.set('sort', sort);
  if (slug) params.set('category', slug);

  const href = `/search${params.toString() ? `?${params.toString()}` : ''}`;
  const DynamicTag = active ? 'p' : Link;

  return (
    <li className="mt-2 flex text-sm text-black dark:text-white">
      <DynamicTag
        href={href}
        className={clsx('w-full underline-offset-4 hover:underline dark:hover:text-neutral-100', {
          'font-medium underline underline-offset-4': active
        })}
      >
        {title}
      </DynamicTag>
    </li>
  );
}

export default function Categories() {
  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
        Categories
      </h3>
      <ul className="hidden md:block">
        {categories.map((cat) => (
          <CategoryItem key={cat.slug} title={cat.title} slug={cat.slug} />
        ))}
      </ul>
      {/* Mobile: dropdown */}
      <ul className="md:hidden">
        <div className="relative">
          <select
            className="w-full appearance-none rounded border border-neutral-200 bg-white px-3 py-2 text-sm text-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            defaultValue=""
            onChange={(e) => {
              const slug = e.target.value;
              const params = new URLSearchParams(window.location.search);
              if (slug) {
                params.set('category', slug);
              } else {
                params.delete('category');
              }
              window.location.href = `/search${params.toString() ? `?${params.toString()}` : ''}`;
            }}
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </ul>
    </nav>
  );
}
