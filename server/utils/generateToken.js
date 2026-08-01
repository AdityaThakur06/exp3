const jwt = require('jsonwebtoken');

/**
 * utils/generateToken.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Centralizes JWT creation so every part of the app signs tokens the
 * same way (same secret, same expiry, same payload shape).
 *
 * HOW JWT WORKS (short version)
 * A JWT is three base64url-encoded parts separated by dots:
 *   header.payload.signature
 * - header: algorithm + token type ({"alg":"HS256","typ":"JWT"})
 * - payload: the claims we choose to embed (id, name, email, role,
 *   plus jwt.sign's automatic `iat` and `exp`)
 * - signature: HMAC-SHA256 of "header.payload" using JWT_SECRET.
 *
 * Because the signature is generated with a secret only the server
 * knows, anyone can READ the payload (it's just base64, not
 * encrypted) but nobody can FORGE a valid signature without the
 * secret. That's what lets verifyToken() later trust the payload's
 * contents (id/role/etc.) without hitting a database.
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

module.exports = generateToken;
