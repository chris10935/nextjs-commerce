/**
 * In-memory demo cart for AuraGlow demo mode.
 * Persists within the Node.js process lifetime — no external storage needed.
 */

import { demoProducts } from './demo-data';
import type { VercelCart, VercelCartItem, VercelProduct } from './types';

// In-memory store keyed by cart ID
const carts = new Map<string, VercelCart>();

let nextCartId = 1;
let nextLineId = 1;

function generateCartId(): string {
  return `demo-cart-${nextCartId++}`;
}

function generateLineId(): string {
  return `demo-line-${nextLineId++}`;
}

function findProduct(productId: string): VercelProduct | undefined {
  return demoProducts.find((p) => p.id === productId);
}

function findProductByVariant(variantId: string): VercelProduct | undefined {
  return demoProducts.find((p) => p.variants.some((v) => v.id === variantId));
}

function recalculate(cart: VercelCart): void {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const line of cart.lines) {
    const unitPrice = parseFloat(line.cost.totalAmount.amount);
    subtotal += unitPrice;
    totalQuantity += line.quantity;
  }

  cart.totalQuantity = totalQuantity;
  cart.cost.subtotalAmount = { amount: subtotal.toFixed(2), currencyCode: 'USD' };
  cart.cost.totalTaxAmount = { amount: (subtotal * 0.08).toFixed(2), currencyCode: 'USD' };
  cart.cost.totalAmount = { amount: (subtotal * 1.08).toFixed(2), currencyCode: 'USD' };
}

export function getDemoCart(cartId: string): VercelCart | undefined {
  return carts.get(cartId);
}

export function addToDemoCart(
  cartId: string | undefined,
  lines: { merchandiseId: string; quantity: number; productId?: string }[]
): VercelCart {
  let cart: VercelCart;

  if (cartId && carts.has(cartId)) {
    cart = carts.get(cartId)!;
  } else {
    const id = generateCartId();
    cart = {
      id,
      checkoutUrl: '#',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      },
      lines: [],
      totalQuantity: 0
    };
    carts.set(id, cart);
  }

  for (const { merchandiseId, quantity, productId } of lines) {
    // Check if this variant is already in the cart
    const existingLine = cart.lines.find((l) => l.merchandise.id === merchandiseId);
    if (existingLine) {
      existingLine.quantity += quantity;
      const unitPrice =
        parseFloat(existingLine.cost.totalAmount.amount) / (existingLine.quantity - quantity);
      existingLine.cost.totalAmount = {
        amount: (unitPrice * existingLine.quantity).toFixed(2),
        currencyCode: 'USD'
      };
      continue;
    }

    // Find the product and variant from demo data
    const product = productId ? findProduct(productId) : findProductByVariant(merchandiseId);
    if (!product) continue;

    const variant = product.variants.find((v) => v.id === merchandiseId);
    if (!variant) continue;

    const lineItem: VercelCartItem = {
      id: generateLineId(),
      quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(variant.price.amount) * quantity).toFixed(2),
          currencyCode: variant.price.currencyCode
        }
      },
      merchandise: {
        id: variant.id,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        product
      }
    };

    cart.lines.push(lineItem);
  }

  recalculate(cart);
  return cart;
}

export function removeFromDemoCart(cartId: string, lineIds: string[]): VercelCart | undefined {
  const cart = carts.get(cartId);
  if (!cart) return undefined;

  cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id));

  if (cart.lines.length === 0) {
    carts.delete(cartId);
    return undefined;
  }

  recalculate(cart);
  return cart;
}

export function updateDemoCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number; productSlug?: string }[]
): VercelCart {
  const cart = carts.get(cartId);
  if (!cart) {
    return {
      id: cartId,
      checkoutUrl: '#',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      },
      lines: [],
      totalQuantity: 0
    };
  }

  for (const { id, quantity } of lines) {
    if (quantity === 0) {
      cart.lines = cart.lines.filter((l) => l.id !== id);
      continue;
    }

    const line = cart.lines.find((l) => l.id === id);
    if (!line) continue;

    // Derive unit price from the variant
    const product = line.merchandise.product;
    const variant = product.variants.find((v) => v.id === line.merchandise.id);
    const unitPrice = variant ? parseFloat(variant.price.amount) : 0;

    line.quantity = quantity;
    line.cost.totalAmount = {
      amount: (unitPrice * quantity).toFixed(2),
      currencyCode: 'USD'
    };
  }

  if (cart.lines.length === 0) {
    carts.delete(cartId);
  } else {
    recalculate(cart);
  }

  return cart;
}
