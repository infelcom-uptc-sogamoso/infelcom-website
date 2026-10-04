import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminRole } from './roles';

/**
 * Server-side admin check for API routes (the proxy also checks, this is the backstop).
 * Responds 401 and returns null when the caller is not an admin.
 */
export const requireAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as { email?: string; role?: string } | undefined;
  if (!user || !isAdminRole(user.role)) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return user;
};
