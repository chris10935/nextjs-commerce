/**
 * AuraGlow demo data — skincare products for sensitive skin.
 * Used when BigCommerce environment variables are not configured.
 */

import type { VercelCart, VercelCollection, VercelMenu, VercelPage, VercelProduct } from './types';

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

function img(bg: string, fg: string, text: string) {
  const t = encodeURIComponent(text);
  return {
    url: `https://placehold.co/800x800/${bg}/${fg}?text=${t}`,
    altText: text,
    width: 800,
    height: 800
  };
}

function makeProduct(o: {
  id: string;
  title: string;
  description: string;
  price: string;
  compareAt?: string;
  bg: string;
  fg: string;
  imgText: string;
  /** Single image URL shorthand (used as first image if `imageUrls` is not set) */
  imageUrl?: string;
  /** Multiple image URLs — first one becomes the featured image */
  imageUrls?: string[];
  options?: VercelProduct['options'];
  variants?: VercelProduct['variants'];
  tags?: string[];
}): VercelProduct {
  const handle = `/product/${o.id}`;

  // Build the images array: prefer imageUrls (multi), fall back to imageUrl (single), then placeholder
  const placeholder = img(o.bg, o.fg, o.imgText);
  let productImages: { url: string; altText: string; width: number; height: number }[];

  if (o.imageUrls && o.imageUrls.length > 0) {
    productImages = o.imageUrls.map((url, i) => ({
      url,
      altText: i === 0 ? o.title : `${o.title} — image ${i + 1}`,
      width: 800,
      height: 800
    }));
  } else if (o.imageUrl) {
    productImages = [{ url: o.imageUrl, altText: o.title, width: 800, height: 800 }];
  } else {
    productImages = [placeholder];
  }

  const featuredImage = productImages[0]!;
  const minPrice = o.compareAt ?? o.price;
  return {
    id: o.id,
    handle,
    availableForSale: true,
    title: o.title,
    description: o.description,
    descriptionHtml: `<p>${o.description}</p>`,
    options: o.options ?? [{ id: 'size', name: 'Size', values: ['30 ml', '50 ml', '100 ml'] }],
    priceRange: {
      maxVariantPrice: { amount: o.price, currencyCode: 'USD' },
      minVariantPrice: { amount: minPrice, currencyCode: 'USD' }
    },
    variants: o.variants ?? [
      {
        id: `${o.id}-v1`,
        parentId: o.id,
        title: '30 ml',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: '30 ml' }],
        price: { amount: minPrice, currencyCode: 'USD' }
      },
      {
        id: `${o.id}-v2`,
        parentId: o.id,
        title: '50 ml',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: '50 ml' }],
        price: { amount: o.price, currencyCode: 'USD' }
      },
      {
        id: `${o.id}-v3`,
        parentId: o.id,
        title: '100 ml',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: '100 ml' }],
        price: { amount: (parseFloat(o.price) * 1.6).toFixed(2), currencyCode: 'USD' }
      }
    ],
    featuredImage,
    images: productImages,
    seo: { title: o.title, description: o.description },
    tags: o.tags ?? ['sensitive skin', 'skincare'],
    updatedAt: new Date().toISOString()
  };
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export const demoProducts: VercelProduct[] = [
  makeProduct({
    id: '1',
    title: ' Hyalu-Cica Water-Fit Sun Serum UV 50ml',
    description:
      'A lightweight serum-like sunscreen that hydrates and soothes the skin for a fresh, no white cast finish. Reformulated with Panthenol and extracts of rice, oat, and soybean to help maintain hydration and comfort.',
    price: '34.00',
    compareAt: '28.00',
    bg: 'fce4ec',
    fg: '880e4f',
    imgText: 'Cream+Cleanser',
    tags: ['serum', 'sensitive skin'],
    imageUrls: [
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112543_1440x.png?v=1762764544',
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204822257_1440x.jpg?v=1763095744',
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112540_1440x.png?v=1763091245',
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112541_1440x.png?v=1763091245',
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112542_1440x.png?v=17630912455'
    ]
  }),
  makeProduct({
    id: '2',
    title: 'Hydra-Soothe Serum',
    description:
      'A lightweight, fragrance-free serum powered by hyaluronic acid and centella asiatica. Deeply hydrates and calms redness in one step.',
    price: '52.00',
    compareAt: '44.00',
    bg: 'ede7f6',
    fg: '4a148c',
    imgText: 'Hydra+Serum',
    tags: ['serum', 'hydrating', 'sensitive skin']
  }),
  makeProduct({
    id: '3',
    title: 'Barrier Repair Moisturizer',
    description:
      'Rich yet non-greasy moisturizer with ceramides, squalane, and aloe vera. Rebuilds the skin barrier overnight and locks in moisture for 72 hours.',
    price: '46.00',
    compareAt: '38.00',
    bg: 'e8f5e9',
    fg: '1b5e20',
    imgText: 'Moisturizer',
    tags: ['moisturizer', 'barrier repair', 'sensitive skin']
  }),
  makeProduct({
    id: '4',
    title: 'Mineral Sunscreen SPF 50',
    description:
      'Zinc-oxide mineral sunscreen with a silky, invisible finish. Broad-spectrum SPF 50 protection without the white cast \u2014 perfect for reactive skin.',
    price: '38.00',
    compareAt: '32.00',
    bg: 'fff8e1',
    fg: 'e65100',
    imgText: 'SPF+50',
    tags: ['sunscreen', 'SPF', 'sensitive skin']
  }),
  makeProduct({
    id: '5',
    title: 'Redness Relief Toner',
    description:
      'Alcohol-free toner infused with niacinamide and green tea to visibly reduce redness and refine pore appearance. Preps skin for serums and moisturizers.',
    price: '29.00',
    compareAt: '24.00',
    bg: 'e0f2f1',
    fg: '004d40',
    imgText: 'Toner',
    tags: ['toner', 'redness relief', 'sensitive skin']
  }),
  makeProduct({
    id: '6',
    title: 'Gentle Eye Cream',
    description:
      'Ultra-gentle eye cream with peptides and caffeine to brighten dark circles and smooth fine lines \u2014 ophthalmologist tested, fragrance-free.',
    price: '42.00',
    compareAt: '36.00',
    bg: 'f3e5f5',
    fg: '6a1b9a',
    imgText: 'Eye+Cream',
    tags: ['eye cream', 'anti-aging', 'sensitive skin']
  }),
  makeProduct({
    id: '7',
    title: 'Overnight Recovery Mask',
    description:
      'A leave-on sleeping mask with bakuchiol and marshmallow root. Wake up to plumper, calmer skin without a trace of irritation.',
    price: '48.00',
    compareAt: '40.00',
    bg: 'fce4ec',
    fg: 'ad1457',
    imgText: 'Sleep+Mask',
    tags: ['mask', 'overnight', 'sensitive skin']
  }),
  makeProduct({
    id: '8',
    title: 'Micellar Cleansing Water',
    description:
      'No-rinse micellar water that gently lifts makeup and impurities in a single swipe. Zero fragrance, zero alcohol \u2014 just clean, calm skin.',
    price: '22.00',
    compareAt: '18.00',
    bg: 'e3f2fd',
    fg: '0d47a1',
    imgText: 'Micellar+Water',
    tags: ['cleanser', 'micellar', 'sensitive skin']
  })
];

/* ------------------------------------------------------------------ */
/* Menus                                                               */
/* ------------------------------------------------------------------ */

export const demoHeaderMenu: VercelMenu[] = [
  { title: 'All Products', path: '/search' },
  { title: 'Cleansers', path: '/search/cleansers' },
  { title: 'Serums', path: '/search/serums' },
  { title: 'Moisturizers', path: '/search/moisturizers' }
];

export const demoFooterMenu: VercelMenu[] = [
  { title: 'About AuraGlow', path: '/about' },
  { title: 'Ingredients', path: '/ingredients' },
  { title: 'Shipping & Returns', path: '/shipping' },
  { title: 'Privacy Policy', path: '/privacy' }
];

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export const demoCollections: VercelCollection[] = [
  {
    handle: 'cleansers',
    title: 'Cleansers',
    description: 'Gentle, sulfate-free cleansers formulated for sensitive and reactive skin.',
    seo: { title: 'Cleansers | AuraGlow', description: 'Gentle cleansers for sensitive skin.' },
    updatedAt: new Date().toISOString(),
    path: '/search/cleansers'
  },
  {
    handle: 'serums',
    title: 'Serums',
    description: 'Targeted treatments that calm, hydrate, and repair \u2014 without irritation.',
    seo: { title: 'Serums | AuraGlow', description: 'Soothing serums for sensitive skin.' },
    updatedAt: new Date().toISOString(),
    path: '/search/serums'
  },
  {
    handle: 'moisturizers',
    title: 'Moisturizers',
    description: 'Barrier-boosting moisturizers that keep sensitive skin hydrated and protected.',
    seo: { title: 'Moisturizers | AuraGlow', description: 'Moisturizers for sensitive skin.' },
    updatedAt: new Date().toISOString(),
    path: '/search/moisturizers'
  },
  {
    handle: 'sun-care',
    title: 'Sun Care',
    description: 'Mineral-based sun protection designed for the most delicate skin.',
    seo: { title: 'Sun Care | AuraGlow', description: 'Mineral sunscreens for sensitive skin.' },
    updatedAt: new Date().toISOString(),
    path: '/search/sun-care'
  }
];

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export const demoPages: VercelPage[] = [
  {
    id: '1',
    title: 'About AuraGlow',
    handle: 'about',
    body: `<h1>About AuraGlow</h1>
<p>AuraGlow was founded on a simple belief: sensitive skin deserves high-performance skincare without compromise. Every formula is dermatologist-tested, fragrance-free, and cruelty-free.</p>
<p>We source clean, clinically proven ingredients \u2014 like ceramides, centella asiatica, and niacinamide \u2014 to soothe, strengthen, and reveal your skin\u2019s natural glow.</p>`,
    bodySummary: 'Clean, gentle skincare for sensitive skin.',
    seo: {
      title: 'About | AuraGlow',
      description: 'Learn about AuraGlow \u2014 skincare for sensitive skin.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Our Ingredients',
    handle: 'ingredients',
    body: `<h1>Our Ingredients</h1>
<p>We never use sulfates, parabens, synthetic fragrance, or harsh alcohols. Instead, every AuraGlow product is built on ingredients your skin will love:</p>
<ul>
<li><strong>Ceramides</strong> \u2014 rebuild and protect the skin barrier.</li>
<li><strong>Centella Asiatica (Cica)</strong> \u2014 calm redness and promote healing.</li>
<li><strong>Niacinamide</strong> \u2014 reduce pores and even skin tone.</li>
<li><strong>Hyaluronic Acid</strong> \u2014 deep hydration without heaviness.</li>
<li><strong>Zinc Oxide</strong> \u2014 gentle, broad-spectrum sun protection.</li>
</ul>`,
    bodySummary: 'Clean ingredients your sensitive skin will love.',
    seo: {
      title: 'Ingredients | AuraGlow',
      description: 'What goes into every AuraGlow product.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/* ------------------------------------------------------------------ */
/* Cart (empty)                                                        */
/* ------------------------------------------------------------------ */

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
