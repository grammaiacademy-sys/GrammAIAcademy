import { createAuthMiddleware } from 'cosmic-authentication';

export const middleware = createAuthMiddleware({
  protectedRoutes: [
    '/dashboard',
    '/search',
    '/saved-items',
    '/export',
  ]
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico).*)',
  ]
};