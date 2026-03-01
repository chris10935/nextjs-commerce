import Footer from 'components/layout/footer';
import Categories from 'components/layout/search/categories';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 pt-8 text-black md:flex-row md:px-6 dark:text-white">
        <div className="order-first w-full flex-none md:max-w-[180px]">
          <div className="sticky top-20">
            <Categories />
            <div className="mt-6">
              <FilterList list={sorting} title="Sort by" />
            </div>
          </div>
        </div>
        <div className="order-last min-h-screen w-full md:order-none">{children}</div>
      </div>
      <Footer />
    </Suspense>
  );
}
