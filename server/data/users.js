const bcrypt = require('bcryptjs');

/**
 * data/users.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Since no database is used, this file acts as our "users table" -
 * a plain in-memory array. Passwords are hashed with bcrypt as soon
 * as this module is loaded (synchronously, at server startup) so
 * that a PLAINTEXT password is never compared or stored anywhere at
 * runtime - only the bcrypt hash is kept in memory.
 *
 * SECURITY NOTE
 * bcrypt.hashSync is fine here because it only runs once at server
 * boot for 3 fixed users. Per-request password hashing (e.g. during
 * signup) should use the async bcrypt.hash() instead so it doesn't
 * block Node's event loop.
 */
const SALT_ROUNDS = 10;

const rawUsers = [
  {
    id: 1,
    name: 'Alice Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    id: 2,
    name: 'Eddie Editor',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'Editor',
  },
  {
    id: 3,
    name: 'Vera Viewer',
    email: 'viewer@example.com',
    password: 'viewer123',
    role: 'Viewer',
  },
];

// Hash every plaintext password once, at module-load time.
const users = rawUsers.map((user) => ({
  ...user,
  password: bcrypt.hashSync(user.password, SALT_ROUNDS),
}));

module.exports = users;
