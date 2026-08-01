/**
 * utils/tokenUtils.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Small helpers for working with a JWT on the client WITHOUT pulling
 * in an extra library (jwt-decode). A JWT's payload segment is just
 * base64url-encoded JSON, so we can decode it ourselves.
 *
 * IMPORTANT: decoding the payload here does NOT verify the token's
 * signature - the browser has no way to do that securely (it would
 * need the server's secret). This is purely a UX helper so we can
 * proactively redirect to /login when a token is obviously expired,
 * without waiting for a 401 from the server. The server's
 * verifyToken middleware remains the actual source of truth for
 * whether a token is valid.
 */

export function decodeToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    // JWTs use base64url; swap characters back to standard base64
    // before atob() can decode it.
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  // `exp` is in seconds since epoch; Date.now() is in milliseconds.
  return decoded.exp * 1000 < Date.now();
}
