import { BIGCOMMERCE_API_URL } from './constants';

interface StorefrontCheckoutResponse {
  data?: {
    cart_url: string;
    checkout_url: string;
    embedded_checkout_url: string;
  };
  status: number;
}

type CheckoutCache = {
  activeCartId: string | null;
  data: StorefrontCheckoutResponse | null;
}

const createCartRedirectUrl = () => {
  const localCache: CheckoutCache= {
    activeCartId: null,
    data: null,
  }

  return async (cartId: string): Promise<StorefrontCheckoutResponse> => {
    const missing = ['BIGCOMMERCE_STORE_HASH', 'BIGCOMMERCE_ACCESS_TOKEN'].filter(
      (key) => !process.env[key]
    );
    if (missing.length) {
      const error = new Error(
        `Missing required BigCommerce env vars for checkout redirects: ${missing.join(', ')}.`
      );
      (error as unknown as { status?: number }).status = 500;
      throw error;
    }

    if (localCache.activeCartId !== cartId || !localCache.data) {
      const response = await fetch(`${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/carts/${cartId}/redirect_urls`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-auth-token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        },
      });
      const data = (await response.json()) as StorefrontCheckoutResponse;

      localCache.activeCartId = cartId;
      localCache.data = data;

      return data;
    }

    return localCache.data;
  };
}

export const memoizedCartRedirectUrl = createCartRedirectUrl();
