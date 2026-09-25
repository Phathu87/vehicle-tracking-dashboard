import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { db } from "../database.js";

const PASSWORD_ROUNDS = 10;
const pendingUsernames = new Set();

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
}

export class DuplicateUsernameError extends Error {
  constructor() {
    super("An account with that username already exists.");
    this.name = "DuplicateUsernameError";
  }
}

export async function createUser({ username, password, name }) {
  const normalizedUsername = normalizeUsername(username);
  if (
    db.prepare("SELECT 1 FROM users WHERE username = ? COLLATE NOCASE").get(normalizedUsername) ||
    pendingUsernames.has(normalizedUsername)
  ) {
    throw new DuplicateUsernameError();
  }

  pendingUsernames.add(normalizedUsername);
  try {
    const user = {
      id: randomUUID(),
      username: username.trim(),
      normalizedUsername,
      name: name?.trim() || username.trim(),
      role: "user",
      passwordHash: await bcrypt.hash(password, PASSWORD_ROUNDS),
      createdAt: new Date().toISOString(),
    };

    try {
      db.prepare("INSERT INTO users (id, username, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .run(user.id, user.username, user.name, user.role, user.passwordHash, user.createdAt);
    } catch (error) {
      if (error.code === "ERR_SQLITE_CONSTRAINT_UNIQUE") throw new DuplicateUsernameError();
      throw error;
    }
    return publicUser(user);
  } finally {
    pendingUsernames.delete(normalizedUsername);
  }
}

export async function verifyCredentials(username, password) {
  const row = db.prepare("SELECT id, username, name, role, password_hash FROM users WHERE username = ? COLLATE NOCASE").get(normalizeUsername(username));
  if (!row || !(await bcrypt.compare(password, row.password_hash))) return null;
  return publicUser(row);
}

export function findPublicUserById(userId) {
  const user = db.prepare("SELECT id, username, name, role FROM users WHERE id = ?").get(userId);
  return user ? publicUser(user) : null;
}

export function resetUsers() {
  db.prepare("DELETE FROM users").run();
  pendingUsernames.clear();
}
