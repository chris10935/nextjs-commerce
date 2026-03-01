'use client';

import clsx from 'clsx';
import type { ProductExtra } from 'lib/bigcommerce/product-extras';
import Image from 'next/image';
import { useState } from 'react';

const tabs = [
  { key: 'details', label: 'Product Details' },
  { key: 'texture', label: 'Texture' },
  { key: 'ingredients', label: 'Ingredients' }
] as const;

type TabKey = (typeof tabs)[number]['key'];

/* ---- Split layout: text left + image right (for details & texture) ---- */
function SplitContent({
  html,
  imageUrl,
  suitedFor
}: {
  html: string;
  imageUrl?: string;
  suitedFor?: string[];
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Text side */}
      <div className="flex-1">
        <div
          className="prose max-w-none text-sm leading-relaxed text-neutral-700"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {suitedFor && suitedFor.length > 0 && (
          <div className="mt-8 flex items-center gap-6">
            <span className="text-sm font-semibold text-neutral-800">Suited For:</span>
            {suitedFor.map((type) => (
              <div key={type} className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                  <svg
                    className="h-5 w-5 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-neutral-600">{type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image side */}
      {imageUrl && (
        <div className="relative hidden w-full max-w-sm flex-shrink-0 overflow-hidden rounded-lg lg:block">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 384px, 0px"
          />
        </div>
      )}
    </div>
  );
}

/* ---- Full-background layout (for ingredients) ---- */
function BgContent({ html, bgImageUrl }: { html: string; bgImageUrl?: string }) {
  if (bgImageUrl) {
    return (
      <div className="relative min-h-[350px] overflow-hidden">
        {/* Background image */}
        <Image src={bgImageUrl} alt="" fill className="object-cover" sizes="100vw" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
            Full Ingredients
          </h3>
          <div
            className="prose max-w-3xl text-sm leading-relaxed text-neutral-200"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    );
  }

  // Fallback without background image
  return (
    <div className="p-8 md:p-12">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-800">
        Full Ingredients
      </h3>
      <div
        className="prose max-w-none text-sm leading-relaxed text-neutral-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export function ProductTabs({ extras }: { extras: ProductExtra }) {
  const [active, setActive] = useState<TabKey>('details');

  const content: Record<TabKey, string | undefined> = {
    details: extras.productDetails,
    texture: extras.texture,
    ingredients: extras.ingredientsList
  };

  // Don't render if there's no tab content at all
  if (!content.details && !content.texture && !content.ingredients) return null;

  // Image lookup per tab
  const tabImage: Record<TabKey, string | undefined> = {
    details: extras.productDetailsImageUrl,
    texture: extras.textureImageUrl,
    ingredients: extras.ingredientsBgImageUrl
  };

  return (
    <section className="mx-auto mt-12 max-w-screen-2xl px-4">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {/* Tab bar */}
        <div className="flex border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={clsx(
                'flex-1 py-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors',
                active === tab.key
                  ? 'border-b-2 border-rose-500 bg-rose-50/40 text-rose-600'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {content[active] ? (
          active === 'ingredients' ? (
            <BgContent html={content[active]!} bgImageUrl={tabImage[active]} />
          ) : (
            <div className="p-8 md:p-12">
              <SplitContent
                html={content[active]!}
                imageUrl={tabImage[active]}
                suitedFor={active === 'details' ? extras.suitedFor : undefined}
              />
            </div>
          )
        ) : (
          <div className="p-8 md:p-12">
            <p className="text-sm italic text-neutral-400">No information available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
