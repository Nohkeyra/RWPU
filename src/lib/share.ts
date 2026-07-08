import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

/**
 * Live public URL of the deployed order form. This is a plain web link that
 * opens in ANY browser — customers do not need the app installed. The site is
 * a HashRouter SPA, so the order form lives at the #/order route.
 */
export const ORDER_FORM_URL = 'https://restoran-wawasan-bio.onrender.com/#/order';

/**
 * Canonical shareable URL that opens the (empty) order form so the customer
 * can fill in their own order details.
 */
export const buildOrderFormUrl = (): string => ORDER_FORM_URL;

/**
 * Trigger the system's native share sheet (Android ACTION_SEND / iOS share) to
 * send the customer a link to the order form. Falls back to the Web Share API,
 * then to clipboard, when the native Capacitor Share plugin is unavailable
 * (e.g. a desktop browser).
 *
 * The customer taps the link and it opens the live order form in their browser
 * (or the app, if installed) — they enter their own details, no manual data
 * entry on your side. Order confirmation reaches them by email.
 */
export const shareOrderForm = async (
  opts?: { title?: string; message?: string }
): Promise<void> => {
  const url = buildOrderFormUrl();
  const title = opts?.title ?? 'Restoran Wawasan Pak Usop';
  const text = opts?.message ?? `Place your order here: ${url}`;

  // Preferred: native share sheet (WhatsApp, SMS, email, etc.)
  if (Capacitor.isNativePlatform()) {
    await Share.share({ title, text, url, dialogTitle: 'Share order form' });
    return;
  }

  // Web fallback: Web Share API where supported
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    await (navigator as Navigator & { share: (d: ShareData) => Promise<void> })
      .share({ title, text, url });
    return;
  }

  // Last resort: copy to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(url);
  }
};
