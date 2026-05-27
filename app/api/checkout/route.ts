import { Checkout } from "@polar-sh/nextjs"

/**
 * GET /api/checkout?products=<polar_product_id>
 *
 * The Polar SDK creates a checkout session for the given product, then
 * 302-redirects the browser to Polar's hosted checkout page. After
 * payment, Polar redirects the user to `successUrl`.
 *
 * Env vars required:
 *   - POLAR_ACCESS_TOKEN              (from polar.sh → Settings → Tokens)
 *   - NEXT_PUBLIC_SITE_URL            (e.g. https://your-domain.com)
 *   - POLAR_SERVER                    "production" | "sandbox" (default: production)
 */
export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/checkout/success?checkout_id={CHECKOUT_ID}`,
  server: (process.env.POLAR_SERVER as "production" | "sandbox") ?? "production",
})
