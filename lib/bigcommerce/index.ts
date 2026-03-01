import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { addToDemoCart, getDemoCart, removeFromDemoCart, updateDemoCart } from './demo-cart';
import {
  demoCollections,
  demoFooterMenu,
  demoHeaderMenu,
  demoPages,
  demoProducts,
  emptyCart
} from './demo-data';
import type { VercelCart, VercelCollection, VercelMenu, VercelPage, VercelProduct } from './types';

import {
  shopifyAddToCart,
  shopifyCreateCart,
  shopifyGetCart,
  shopifyGetCollection,
  shopifyGetCollectionProducts,
  shopifyGetCollections,
  shopifyGetMenu,
  shopifyGetPage,
  shopifyGetPages,
  shopifyGetProduct,
  shopifyGetProductRecommendations,
  shopifyGetProducts,
  shopifyRemoveFromCart,
  shopifyUpdateCart
} from 'lib/shopify';

// ---------- Demo mode detection ----------
// Falls back to demo data when Shopify credentials are not configured
const isDemoMode =
  !process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export async function createCart(): Promise<VercelCart> {
  if (isDemoMode) return emptyCart;
  return shopifyCreateCart();
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; productId?: string }[]
): Promise<VercelCart> {
  if (isDemoMode) return addToDemoCart(cartId || undefined, lines);
  return shopifyAddToCart(cartId, lines);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<VercelCart | undefined> {
  if (isDemoMode) return removeFromDemoCart(cartId, lineIds);
  return shopifyRemoveFromCart(cartId, lineIds);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number; productSlug?: string }[]
): Promise<VercelCart> {
  if (isDemoMode) return updateDemoCart(cartId, lines);
  return shopifyUpdateCart(
    cartId,
    lines.map(({ id, merchandiseId, quantity }) => ({ id, merchandiseId, quantity }))
  );
}

export async function getCart(cartId: string): Promise<VercelCart | undefined> {
  if (isDemoMode) return getDemoCart(cartId);
  return shopifyGetCart(cartId);
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export async function getCollection(handle: string): Promise<VercelCollection> {
  if (isDemoMode) {
    return demoCollections.find((c) => c.handle === handle) ?? demoCollections[0]!;
  }
  const collection = await shopifyGetCollection(handle);
  if (!collection) {
    return demoCollections[0]!;
  }
  return collection;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<VercelProduct[]> {
  if (isDemoMode) {
    // Homepage collections - return all products
    if (collection.startsWith('hidden-homepage-')) return demoProducts;

    // Map collection handle -> tag keywords for filtering
    const collectionTagMap: Record<string, string[]> = {
      cleansers: ['cleanser', 'micellar'],
      serums: ['serum'],
      moisturizers: ['moisturizer', 'barrier repair'],
      'sun-care': ['sunscreen', 'spf']
    };

    const tagKeywords = collectionTagMap[collection];
    if (!tagKeywords) return demoProducts; // unknown collection -> show all

    return demoProducts.filter((p) =>
      p.tags.some((tag) => tagKeywords.some((kw) => tag.toLowerCase().includes(kw.toLowerCase())))
    );
  }
  return shopifyGetCollectionProducts({ collection, reverse, sortKey });
}

export async function getCollections(): Promise<VercelCollection[]> {
  if (isDemoMode) return demoCollections;
  return shopifyGetCollections();
}

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------

export async function getMenu(handle: string): Promise<VercelMenu[]> {
  if (isDemoMode) {
    if (handle === 'next-js-frontend-footer-menu') return demoFooterMenu;
    if (handle === 'next-js-frontend-header-menu') return demoHeaderMenu;
    return [];
  }
  return shopifyGetMenu(handle);
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export async function getPage(handle: string): Promise<VercelPage> {
  if (isDemoMode) {
    const page = demoPages.find((p) => p.handle === handle);
    if (!page) notFound();
    return page;
  }
  const page = await shopifyGetPage(handle);
  if (!page) notFound();
  return page;
}

export async function getPages(): Promise<VercelPage[]> {
  if (isDemoMode) return demoPages;
  return shopifyGetPages();
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProduct(handle: string): Promise<VercelProduct | undefined> {
  if (isDemoMode) return demoProducts.find((p) => p.id === handle);
  return shopifyGetProduct(handle);
}

export async function getProductIdBySlug(
  _path: string
): Promise<{ __typename: string; entityId: number } | undefined> {
  // Shopify doesn't use numeric entity IDs; this is a BigCommerce-only concept.
  // The middleware slug resolution is handled differently with Shopify.
  return undefined;
}

export async function getProductRecommendations(productId: string): Promise<VercelProduct[]> {
  if (isDemoMode) return demoProducts.filter((p) => p.id !== productId).slice(0, 4);
  return shopifyGetProductRecommendations(productId);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<VercelProduct[]> {
  if (isDemoMode) {
    if (query) {
      const q = query.toLowerCase();
      return demoProducts.filter((p) => p.title.toLowerCase().includes(q));
    }
    return demoProducts;
  }
  return shopifyGetProducts({ query, reverse, sortKey });
}

// ---------------------------------------------------------------------------
// Revalidation
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
