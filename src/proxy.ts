import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { LOCALE_COOKIE, pickLocale } from '@/i18n/locale';
import { isAdminRole } from '@/utils/roles';

export async function proxy(req: NextRequest) {
  const { pathname, search, locale } = req.nextUrl;

  if (pathname.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!isAdminRole((token?.user as { role?: string } | undefined)?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Language: the user's manual choice (cookie) wins, otherwise the browser's preferred language.
  // Unprefixed URLs are English, so only Spanish needs a redirect (to /es/...).
  const wanted = req.cookies.get(LOCALE_COOKIE)?.value ?? pickLocale(req.headers.get('accept-language'));
  if (wanted === 'es' && locale !== 'es') {
    return NextResponse.redirect(new URL(`/es${pathname === '/' ? '' : pathname}${search}`, req.url));
  }

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const prefix = locale === 'es' ? '/es' : '';
    if (!token) {
      return NextResponse.redirect(
        new URL(`${prefix}/auth/login?p=${encodeURIComponent(pathname)}`, req.url),
      );
    }
    if (!isAdminRole((token.user as { role?: string } | undefined)?.role)) {
      return NextResponse.redirect(new URL(prefix || '/', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Every page (for language detection) plus the admin API; skips other APIs, assets and files.
  // '/' is listed on its own: with i18n enabled the catch-all pattern does not match the root.
  matcher: ['/', '/((?!api|_next|.*\\..*).*)', '/api/admin/:path*'],
};
