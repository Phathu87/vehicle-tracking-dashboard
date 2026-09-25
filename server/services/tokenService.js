import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

const ISSUER = "fleet-drive-ai-demo";
const AUDIENCE = "fleet-drive-ai-demo-frontend";
const developmentSecret = randomBytes(64).toString("hex");

function getJwtSecret() {
  const configuredSecret = process.env.JWT_SECRET?.trim();
  if (configuredSecret) return configuredSecret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required when NODE_ENV=production");
  }

  return developmentSecret;
}

export function assertAuthConfig() {
  getJwtSecret();
}

export function signUserToken(user, { rememberMe = false } = {}) {
  return jwt.sign(
    { role: user.role, username: user.username },
    getJwtSecret(),
    {
      subject: user.id,
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: rememberMe ? "30d" : "8h",
    },
  );
}

export function verifyUserToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}
