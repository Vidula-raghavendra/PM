import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LOCALE_BY_CURRENCY: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "en-AE",
};

/**
 * Formats an amount in the project's own currency. Projects carry a currency
 * column, so amounts must not be hardcoded to ₹.
 */
export function formatMoney(amount: number, currency = "INR") {
  const locale = LOCALE_BY_CURRENCY[currency] ?? "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Unknown currency code — fall back to a plain number with the code.
    return `${currency} ${amount.toLocaleString(locale)}`;
  }
}
