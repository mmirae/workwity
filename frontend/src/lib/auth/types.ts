/**
 * "guest" — not logged in. "seeker" / "company" — logged in as that role.
 * Admin has no self-serve entry point (Design System §12 / IA A-01): it's
 * reached only with a pre-provisioned account, never through this mock switch.
 */
export type UserRole = "guest" | "seeker" | "company";
