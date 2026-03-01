/**
 * Extended product data that doesn't fit in the VercelProduct type.
 * Keyed by product id.
 */

export interface ProductExtra {
  subtitle?: string;
  keyIngredients?: { name: string; description: string }[];
  badges?: { icon: string; label: string }[];
  productDetails?: string;
  /** Image shown on the right side of the Product Details tab */
  productDetailsImageUrl?: string;
  texture?: string;
  /** Image shown on the right side of the Texture tab */
  textureImageUrl?: string;
  ingredientsList?: string;
  /** Full-width background image for the Ingredients tab (dark overlay applied) */
  ingredientsBgImageUrl?: string;
  howToUse?: string;
  howToUseImageUrl?: string;
  suitedFor?: string[];
}

const extras: Record<string, ProductExtra> = {
  '1': {
    subtitle: 'Centella 50ml SPF50+ Sun Serum',
    keyIngredients: [
      {
        name: 'Centella Asiatica Extract',
        description: 'Soothes and calms sensitive skin'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'Intense hydration & moisture retention'
      },
      {
        name: 'Niacinamide (Vitamin B3)',
        description: 'Brightens and evens skin tone'
      },
      {
        name: 'Panthenol (Vitamin B5)',
        description: 'Strengthens skin barrier'
      }
    ],
    badges: [
      { icon: 'vegan', label: 'Peta Vegan & Cruelty Free' },
      { icon: 'ewg', label: 'EWG Green Grade' },
      { icon: 'fragrance', label: 'Artificial Fragrance Free' }
    ],
    productDetails: `<p><strong>Hyalu-Cica Water-Fit Sun Serum UV</strong></p>
<p>A lightweight sun serum with SPF50+ broad spectrum coverage for everyday protection. Ultra-light, serum-like texture that absorbs quickly and leaves a dewy, no-white-cast finish — perfect for daily use.</p>
<p>Made with 10,000ppm Centella Asiatica extract combined with Hyaluronic Acid and Panthenol for continuous hydration throughout the day.</p>
<p><strong>Suited For:</strong> Normal, Dry, Combination skin types</p>`,
    texture:
      'Water-light, serum-like texture that glides on smoothly. Absorbs instantly without any sticky or greasy residue. Leaves a natural, dewy finish.',
    ingredientsList:
      'Water, Centella Asiatica Extract, Homosalate, Ethylhexyl Methoxycinnamate, Dibutyl Adipate, Niacinamide, Glycerin, Panthenol, Hyaluronic Acid, Butylene Glycol, Cetearyl Olivate, Sorbitan Olivate, 1,2-Hexanediol, Caprylyl Glycol, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Tromethamine.',
    productDetailsImageUrl:
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112543_1440x.png?v=1762764544',
    textureImageUrl:
      'https://www.skin1004.com/cdn/shop/files/skin1004-50ml-hyalu-cica-water-fit-sun-serum-uv-1204112543_1440x.png?v=1762764544',
    ingredientsBgImageUrl:
      'https://images.unsplash.com/photo-1542273917363-1f3f7a4c89c3?w=1600&q=80',
    howToUse:
      'Apply generously as the last step of your morning skincare routine, 15 minutes before sun exposure. Reapply every 2-3 hours for continuous protection. Suitable for face, neck, and décolleté.',
    suitedFor: ['Normal', 'Dry', 'Combination']
  },
  '2': {
    subtitle: 'Fragrance-Free Hydrating Serum',
    keyIngredients: [
      { name: 'Hyaluronic Acid', description: 'Deep hydration without heaviness' },
      { name: 'Centella Asiatica', description: 'Calms redness and irritation' },
      { name: 'Allantoin', description: 'Soothes and protects sensitive skin' }
    ],
    badges: [
      { icon: 'vegan', label: 'Peta Vegan & Cruelty Free' },
      { icon: 'fragrance', label: 'Fragrance Free' }
    ],
    productDetails:
      '<p>A lightweight, fragrance-free serum powered by hyaluronic acid and centella asiatica. Deeply hydrates and calms redness in one step.</p>',
    howToUse:
      'After cleansing and toning, apply 2-3 drops to face and neck. Pat gently until absorbed. Follow with moisturizer.'
  },
  '3': {
    subtitle: 'Ceramide-Rich Night Moisturizer',
    keyIngredients: [
      { name: 'Ceramides NP/AP/EOP', description: 'Rebuild and protect skin barrier' },
      { name: 'Squalane', description: 'Lightweight yet deeply nourishing' },
      { name: 'Aloe Vera', description: 'Cooling and soothing hydration' }
    ],
    badges: [
      { icon: 'vegan', label: 'Cruelty Free' },
      { icon: 'fragrance', label: 'Fragrance Free' }
    ],
    productDetails:
      '<p>Rich yet non-greasy moisturizer with ceramides, squalane, and aloe vera. Rebuilds the skin barrier overnight and locks in moisture for 72 hours.</p>',
    howToUse:
      'Apply a generous amount to clean face and neck in the evening as your last skincare step. Massage gently in upward motions.'
  },
  '4': {
    subtitle: 'Mineral Broad-Spectrum Protection',
    keyIngredients: [
      { name: 'Zinc Oxide 20%', description: 'Mineral UV filter, gentle on skin' },
      { name: 'Niacinamide', description: 'Reduces redness and uneven tone' },
      { name: 'Vitamin E', description: 'Antioxidant protection' }
    ],
    badges: [
      { icon: 'ewg', label: 'EWG Green Grade' },
      { icon: 'fragrance', label: 'Fragrance Free' }
    ],
    productDetails:
      '<p>Zinc-oxide mineral sunscreen with a silky, invisible finish. Broad-spectrum SPF 50 protection without the white cast.</p>',
    howToUse:
      'Apply liberally 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.'
  }
};

export function getProductExtras(productId: string): ProductExtra {
  return extras[productId] ?? {};
}
