export const COOKIE_NAME = 'bloomcrawler-session';

export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: ONE_YEAR_MS,
    path: '/',
  };
}
