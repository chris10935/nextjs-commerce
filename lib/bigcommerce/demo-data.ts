/**
 * Demo / mock data used when BigCommerce environment variables are not configured.
 * This lets the storefront render a realistic-looking UI without a real backend.
 */

import type { VercelCart, VercelCollection, VercelMenu, VercelPage, VercelProduct } from './types';

const placeholderImage = {
  url: 'https://placehold.co/800x800/e2e8f0/475569?text=Demo+Product',
  altText: 'Demo product image',
  width: 800,
  height: 800
};

function makeDemoProduct(
  overrides: Partial<VercelProduct> & { id: string; title: string }
): VercelProduct {
  const handle = `/product/${overrides.id}`;
  return {
    id: overrides.id,
    handle,
    availableForSale: true,
    title: overrides.title,
    description:
      overrides.description ??
      'This is a demo product. Connect your BigCommerce store to see real data.',
    descriptionHtml:
      overrides.descriptionHtml ??
      '<p>This is a demo product. Connect your BigCommerce store to see real data.</p>',
    options: overrides.options ?? [
      { id: 'color', name: 'Color', values: ['Black', 'White'] },
      { id: 'size', name: 'Size', values: ['S', 'M', 'L', 'XL'] }
    ],
    priceRange: overrides.priceRange ?? {
      maxVariantPrice: { amount: '49.99', currencyCode: 'USD' },
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
    },
    variants: overrides.variants ?? [
      {
        id: `${overrides.id}-variant-1`,
        title: 'Black / S',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Black' },
          { name: 'Size', value: 'S' }
        ],
        price: { amount: '29.99', currencyCode: 'USD' }
      },
      {
        id: `${overrides.id}-variant-2`,
        title: 'White / M',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'White' },
          { name: 'Size', value: 'M' }
        ],
        price: { amount: '49.99', currencyCode: 'USD' }
      }
    ],
    featuredImage: overrides.featuredImage ?? placeholderImage,
    images: overrides.images ?? [placeholderImage],
    seo: overrides.seo ?? { title: overrides.title, description: 'Demo product' },
    tags: overrides.tags ?? ['demo'],
    updatedAt: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const demoProducts: VercelProduct[] = [
  makeDemoProduct({
    id: '1',
    title: 'Classic T-Shirt',
    priceRange: {
      maxVariantPrice: { amount: '35.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '25.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/1e293b/f8fafc?text=Classic+Tee',
      altText: 'Classic T-Shirt',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/1e293b/f8fafc?text=Classic+Tee',
        altText: 'Classic T-Shirt',
        width: 800,
        height: 800
      }
    ]
  }),
  makeDemoProduct({
    id: '2',
    title: 'Lightweight Jacket',
    priceRange: {
      maxVariantPrice: { amount: '120.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '99.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/0f172a/e2e8f0?text=Jacket',
      altText: 'Lightweight Jacket',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/0f172a/e2e8f0?text=Jacket',
        altText: 'Lightweight Jacket',
        width: 800,
        height: 800
      }
    ]
  }),
  makeDemoProduct({
    id: '3',
    title: 'Everyday Hoodie',
    priceRange: {
      maxVariantPrice: { amount: '75.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '65.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/334155/f1f5f9?text=Hoodie',
      altText: 'Everyday Hoodie',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/334155/f1f5f9?text=Hoodie',
        altText: 'Everyday Hoodie',
        width: 800,
        height: 800
      }
    ]
  }),
  makeDemoProduct({
    id: '4',
    title: 'Running Sneakers',
    priceRange: {
      maxVariantPrice: { amount: '150.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '130.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/475569/f8fafc?text=Sneakers',
      altText: 'Running Sneakers',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/475569/f8fafc?text=Sneakers',
        altText: 'Running Sneakers',
        width: 800,
        height: 800
      }
    ]
  }),
  makeDemoProduct({
    id: '5',
    title: 'Canvas Backpack',
    priceRange: {
      maxVariantPrice: { amount: '89.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '79.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/64748b/f8fafc?text=Backpack',
      altText: 'Canvas Backpack',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/64748b/f8fafc?text=Backpack',
        altText: 'Canvas Backpack',
        width: 800,
        height: 800
      }
    ]
  }),
  makeDemoProduct({
    id: '6',
    title: 'Leather Belt',
    priceRange: {
      maxVariantPrice: { amount: '45.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '40.00', currencyCode: 'USD' }
    },
    featuredImage: {
      url: 'https://placehold.co/800x800/94a3b8/1e293b?text=Belt',
      altText: 'Leather Belt',
      width: 800,
      height: 800
    },
    images: [
      {
        url: 'https://placehold.co/800x800/94a3b8/1e293b?text=Belt',
        altText: 'Leather Belt',
        width: 800,
        height: 800
      }
    ]
  })
];

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------

export const demoHeaderMenu: VercelMenu[] = [
  { title: 'All', path: '/search' },
  { title: 'Shirts', path: '/search/shirts' },
  { title: 'Jackets', path: '/search/jackets' }
];

export const demoFooterMenu: VercelMenu[] = [
  { title: 'About', path: '/about' },
  { title: 'Terms', path: '/terms' },
  { title: 'Privacy', path: '/privacy' }
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const demoCollections: VercelCollection[] = [
  {
    handle: 'shirts',
    title: 'Shirts',
    description: 'Demo collection of shirts',
    seo: { title: 'Shirts', description: 'Demo shirts collection' },
    updatedAt: new Date().toISOString(),
    path: '/search/shirts'
  },
  {
    handle: 'jackets',
    title: 'Jackets',
    description: 'Demo collection of jackets',
    seo: { title: 'Jackets', description: 'Demo jackets collection' },
    updatedAt: new Date().toISOString(),
    path: '/search/jackets'
  }
];

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export const demoPages: VercelPage[] = [
  {
    id: '1',
    title: 'About',
    handle: 'about',
    body: '<h1>About Us</h1><p>This is a demo page. Connect your BigCommerce store to see real content.</p>',
    bodySummary: 'About the store',
    seo: { title: 'About', description: 'About the demo store' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ---------------------------------------------------------------------------
// Cart (empty)
// ---------------------------------------------------------------------------

export const emptyCart: VercelCart = {
  id: '',
  checkoutUrl: '',
  cost: {
    subtotalAmount: { amount: '0', currencyCode: 'USD' },
    totalAmount: { amount: '0', currencyCode: 'USD' },
    totalTaxAmount: { amount: '0', currencyCode: 'USD' }
  },
  lines: [],
  totalQuantity: 0
};
