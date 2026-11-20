import { createHash, timingSafeEqual } from "node:crypto";

const USERNAME = /^[a-zA-Z0-9._@+-]{3,64}$/;
const HEX_256 = /^[a-f0-9]{64}$/i;
const MAX_WINDOW_MS = 24 * 60 * 60 * 1000;

export function registrationAllowed(req, environment = process.env, now = Date.now()) {
  if (environment.NODE_ENV !== "production") return true;

  const configuration = environment.REGISTRATION_TEST_INVITES_JSON;
  if (typeof configuration !== "string" || configuration.length > 16384) return false;
  const username = req.body?.username;
  const token = req.get("X-Registration-Invite");
  if (typeof username !== "string" || !USERNAME.test(username.trim()) || !HEX_256.test(token || "")) {
    return false;
  }

  try {
    const entries = JSON.parse(configuration);
    if (!Array.isArray(entries) || entries.length === 0 || entries.length > 25) return false;
    const usernames = new Set();
    const digests = new Set();
    // Invalid or ambiguous configuration closes admission rather than partially enabling it.
    for (const entry of entries) {
      if (!entry || typeof entry.username !== "string" || !USERNAME.test(entry.username)
        || typeof entry.tokenSha256 !== "string" || !HEX_256.test(entry.tokenSha256)
        || typeof entry.expiresAt !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(entry.expiresAt)) return false;
      const key = entry.username.toLowerCase();
      const digest = entry.tokenSha256.toLowerCase();
      const expiry = Date.parse(entry.expiresAt);
      if (usernames.has(key) || digests.has(digest) || !Number.isFinite(expiry)
        || expiry > now + MAX_WINDOW_MS) return false;
      usernames.add(key);
      digests.add(digest);
    }
    const entry = entries.find((candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase());
    if (!entry || Date.parse(entry.expiresAt) <= now) return false;
    const provided = createHash("sha256").update(token).digest();
    return timingSafeEqual(provided, Buffer.from(entry.tokenSha256, "hex"));
  } catch {
    return false;
  }
}
