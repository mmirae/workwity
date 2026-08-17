/**
 * Routes that should hide the global Header/Footer for a focused,
 * single-task flow. The Work-TI test and company onboarding used to be
 * listed here, but both now keep the global Header/Footer visible (users
 * need Header nav — e.g. to reach the seeker/company picker — while a test
 * is in progress). Kept as an empty, ready-to-use mechanism in case a truly
 * focused flow (e.g. a checkout step) needs it later.
 */
const FOCUSED_ROUTE_PREFIXES: string[] = [];

export function isFocusedRoute(pathname: string): boolean {
  return FOCUSED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
