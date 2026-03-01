import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center px-6 py-16 text-center md:py-24 lg:py-32">
        {/* Badge */}
        <span className="mb-4 inline-block rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          New Arrivals
        </span>

        {/* Heading */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
          Gentle Skincare,{' '}
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Visible Results
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 max-w-xl text-base text-neutral-600 md:text-lg dark:text-neutral-400">
          Dermatologist-tested formulas for sensitive skin. Clean ingredients you can trust, results
          you can see.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            href="/search"
            className="inline-block animate-bounce rounded-full bg-rose-500 px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/30"
          >
            Shop All Products
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Dermatologist Tested
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Cruelty-Free
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Free Shipping $50+
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            30-Day Returns
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
    </section>
  );
}
