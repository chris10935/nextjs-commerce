/**
 * Shopify Storefront API client.
 *
 * Provides thin wrappers around the Storefront API that return the shared
 * Vercel Commerce types so the rest of the app can consume them without
 * knowing which provider is active.
 */

import type {
    Image,
    VercelCart,
    VercelCartItem,
    VercelCollection,
    VercelMenu,
    VercelPage,
    VercelProduct,
    VercelProductOption,
    VercelProductVariant
} from 'lib/bigcommerce/types';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

// ---------------------------------------------------------------------------
// Generic fetch helper
// ---------------------------------------------------------------------------

export async function shopifyFetch<T>({
  query,
  variables,
  cache = process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache'
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<{ status: number; body: T }> {
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken
    },
    body: JSON.stringify({ query, variables }),
    cache
  });

  const body = (await result.json()) as T;
  return { status: result.status, body };
}

// ---------------------------------------------------------------------------
// GraphQL fragments
// ---------------------------------------------------------------------------

const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    title
    description
  }
`;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${productFragment}
`;

// ---------------------------------------------------------------------------
// Mappers  (Shopify → Vercel types)
// ---------------------------------------------------------------------------

function reshapeImages(images: { edges: { node: any }[] }): Image[] {
  return images.edges.map(({ node }) => ({
    url: node.url,
    altText: node.altText || '',
    width: node.width,
    height: node.height
  }));
}

function reshapeProduct(node: any): VercelProduct {
  const images = reshapeImages(node.images);
  const variants: VercelProductVariant[] = node.variants.edges.map(({ node: v }: any) => ({
    id: v.id,
    parentId: node.id,
    title: v.title,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    price: v.price
  }));
  const options: VercelProductOption[] = node.options.map((o: any) => ({
    id: o.id,
    name: o.name,
    values: o.values
  }));

  return {
    id: node.id,
    handle: `/product/${node.handle}`,
    availableForSale: node.availableForSale,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    options,
    priceRange: node.priceRange,
    variants,
    featuredImage: node.featuredImage
      ? {
          url: node.featuredImage.url,
          altText: node.featuredImage.altText || '',
          width: node.featuredImage.width,
          height: node.featuredImage.height
        }
      : images[0] ?? { url: '', altText: '', width: 0, height: 0 },
    images,
    seo: {
      title: node.seo?.title || node.title,
      description: node.seo?.description || node.description
    },
    tags: node.tags ?? [],
    updatedAt: node.updatedAt
  };
}

function reshapeCart(cart: any): VercelCart {
  const lines: VercelCartItem[] = cart.lines.edges.map(({ node }: any) => ({
    id: node.id,
    quantity: node.quantity,
    cost: node.cost,
    merchandise: {
      id: node.merchandise.id,
      title: node.merchandise.title,
      selectedOptions: node.merchandise.selectedOptions,
      product: reshapeProduct(node.merchandise.product)
    }
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    cost: cart.cost,
    lines,
    totalQuantity: cart.totalQuantity
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function shopifyGetProduct(handle: string): Promise<VercelProduct | undefined> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getProduct($handle: String!) {
        product(handle: $handle) {
          ...product
        }
      }
      ${productFragment}
    `,
    variables: { handle }
  });

  if (!body.data?.product) return undefined;
  return reshapeProduct(body.data.product);
}

export async function shopifyGetProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<VercelProduct[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getProducts($query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $first: Int) {
        products(query: $query, sortKey: $sortKey, reverse: $reverse, first: $first) {
          edges {
            node {
              ...product
            }
          }
        }
      }
      ${productFragment}
    `,
    variables: {
      query: query || '',
      sortKey: sortKey?.toUpperCase() || 'RELEVANCE',
      reverse: reverse ?? false,
      first: 100
    }
  });

  return (body.data?.products?.edges ?? []).map(({ node }: any) => reshapeProduct(node));
}

export async function shopifyGetProductRecommendations(
  productId: string
): Promise<VercelProduct[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getProductRecommendations($productId: ID!) {
        productRecommendations(productId: $productId) {
          ...product
        }
      }
      ${productFragment}
    `,
    variables: { productId }
  });

  return (body.data?.productRecommendations ?? []).map((node: any) => reshapeProduct(node));
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export async function shopifyGetCollections(): Promise<VercelCollection[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getCollections {
        collections(first: 100) {
          edges {
            node {
              handle
              title
              description
              seo {
                ...seo
              }
              updatedAt
            }
          }
        }
      }
      ${seoFragment}
    `
  });

  return (body.data?.collections?.edges ?? []).map(({ node }: any) => ({
    handle: node.handle,
    title: node.title,
    description: node.description,
    seo: { title: node.seo?.title || node.title, description: node.seo?.description || '' },
    updatedAt: node.updatedAt,
    path: `/search/${node.handle}`
  }));
}

export async function shopifyGetCollection(handle: string): Promise<VercelCollection | undefined> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getCollection($handle: String!) {
        collection(handle: $handle) {
          handle
          title
          description
          seo {
            ...seo
          }
          updatedAt
        }
      }
      ${seoFragment}
    `,
    variables: { handle }
  });

  const c = body.data?.collection;
  if (!c) return undefined;

  return {
    handle: c.handle,
    title: c.title,
    description: c.description,
    seo: { title: c.seo?.title || c.title, description: c.seo?.description || '' },
    updatedAt: c.updatedAt,
    path: `/search/${c.handle}`
  };
}

export async function shopifyGetCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<VercelProduct[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getCollectionProducts(
        $handle: String!
        $sortKey: ProductCollectionSortKeys
        $reverse: Boolean
        $first: Int
      ) {
        collection(handle: $handle) {
          products(sortKey: $sortKey, reverse: $reverse, first: $first) {
            edges {
              node {
                ...product
              }
            }
          }
        }
      }
      ${productFragment}
    `,
    variables: {
      handle: collection,
      sortKey: sortKey?.toUpperCase() || 'RELEVANCE',
      reverse: reverse ?? false,
      first: 100
    }
  });

  return (body.data?.collection?.products?.edges ?? []).map(({ node }: any) =>
    reshapeProduct(node)
  );
}

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------

export async function shopifyGetMenu(handle: string): Promise<VercelMenu[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getMenu($handle: String!) {
        menu(handle: $handle) {
          items {
            title
            url
          }
        }
      }
    `,
    variables: { handle }
  });

  return (body.data?.menu?.items ?? []).map((item: any) => {
    // Shopify returns full URLs; extract the path portion.
    const url = new URL(item.url, `https://${domain}`);
    const path =
      url.pathname === '/collections'
        ? '/search'
        : url.pathname.replace('/collections/', '/search/').replace('/pages/', '/');
    return { title: item.title, path };
  });
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export async function shopifyGetPages(): Promise<VercelPage[]> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getPages {
        pages(first: 100) {
          edges {
            node {
              id
              title
              handle
              body
              bodySummary
              seo {
                ...seo
              }
              createdAt
              updatedAt
            }
          }
        }
      }
      ${seoFragment}
    `
  });

  return (body.data?.pages?.edges ?? []).map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    body: node.body,
    bodySummary: node.bodySummary,
    seo: { title: node.seo?.title || node.title, description: node.seo?.description || '' },
    createdAt: node.createdAt,
    updatedAt: node.updatedAt
  }));
}

export async function shopifyGetPage(handle: string): Promise<VercelPage | undefined> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getPage($handle: String!) {
        page(handle: $handle) {
          id
          title
          handle
          body
          bodySummary
          seo {
            ...seo
          }
          createdAt
          updatedAt
        }
      }
      ${seoFragment}
    `,
    variables: { handle }
  });

  const p = body.data?.page;
  if (!p) return undefined;

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    body: p.body,
    bodySummary: p.bodySummary,
    seo: { title: p.seo?.title || p.title, description: p.seo?.description || '' },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export async function shopifyCreateCart(): Promise<VercelCart> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      mutation createCart {
        cartCreate {
          cart {
            ...cart
          }
        }
      }
      ${cartFragment}
    `,
    cache: 'no-store'
  });

  return reshapeCart(body.data.cartCreate.cart);
}

export async function shopifyAddToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<VercelCart> {
  // If no cart exists yet, create one with the initial lines
  if (!cartId) {
    const { body } = await shopifyFetch<any>({
      query: /* GraphQL */ `
        mutation createCartWithLines($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              ...cart
            }
          }
        }
        ${cartFragment}
      `,
      variables: { lines },
      cache: 'no-store'
    });

    return reshapeCart(body.data.cartCreate.cart);
  }

  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...cart
          }
        }
      }
      ${cartFragment}
    `,
    variables: { cartId, lines },
    cache: 'no-store'
  });

  return reshapeCart(body.data.cartLinesAdd.cart);
}

export async function shopifyRemoveFromCart(
  cartId: string,
  lineIds: string[]
): Promise<VercelCart | undefined> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...cart
          }
        }
      }
      ${cartFragment}
    `,
    variables: { cartId, lineIds },
    cache: 'no-store'
  });

  const cart = body.data?.cartLinesRemove?.cart;
  if (!cart) return undefined;
  return reshapeCart(cart);
}

export async function shopifyUpdateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<VercelCart> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...cart
          }
        }
      }
      ${cartFragment}
    `,
    variables: { cartId, lines },
    cache: 'no-store'
  });

  return reshapeCart(body.data.cartLinesUpdate.cart);
}

export async function shopifyGetCart(cartId: string): Promise<VercelCart | undefined> {
  const { body } = await shopifyFetch<any>({
    query: /* GraphQL */ `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          ...cart
        }
      }
      ${cartFragment}
    `,
    variables: { cartId },
    cache: 'no-store'
  });

  const cart = body.data?.cart;
  if (!cart) return undefined;
  return reshapeCart(cart);
}
