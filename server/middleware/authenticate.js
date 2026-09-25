import { findPublicUserById } from "../services/userService.js";
import { verifyUserToken } from "../services/tokenService.js";

function unauthorized(res, message = "Authentication is required.") {
  return res.status(401).json({
    error: {
      code: "AUTH_REQUIRED",
      message,
      details: {},
    },
  });
}

export function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return unauthorized(res);

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return unauthorized(res);

  try {
    const payload = verifyUserToken(token);
    const user = findPublicUserById(payload.sub);
    if (!user) return unauthorized(res, "The authenticated user no longer exists.");
    req.user = user;
    return next();
  } catch {
    return unauthorized(res, "The authentication token is invalid or expired.");
  }
}
