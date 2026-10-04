/** Roles allowed into /admin and /api/admin. Must match the User model's role enum. */
export const ADMIN_ROLES = ['admin'];

export const isAdminRole = (role: unknown) => typeof role === 'string' && ADMIN_ROLES.includes(role);
