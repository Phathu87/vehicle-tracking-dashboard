import {
  createUser,
  DuplicateUsernameError,
  verifyCredentials,
} from "../services/userService.js";
import { signUserToken } from "../services/tokenService.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9._@+-]{3,64}$/;

function validationError(res, message, details = {}) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message,
      details,
    },
  });
}

function validateCredentials(body, { registration = false } = {}) {
  const errors = {};

  if (typeof body?.username !== "string" || !USERNAME_PATTERN.test(body.username.trim())) {
    errors.username = "Username must be 3-64 characters using letters, numbers, or . _ @ + -.";
  }
  if (typeof body?.password !== "string" || body.password.length < 8 || body.password.length > 128) {
    errors.password = "Password must be between 8 and 128 characters.";
  }
  if (
    registration &&
    body?.name !== undefined &&
    (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 100)
  ) {
    errors.name = "Name must be between 1 and 100 characters when provided.";
  }
  if (registration && body?.role !== undefined && body.role !== "user") {
    errors.role = "Public registration can create only user accounts.";
  }
  if (!registration && body?.rememberMe !== undefined && typeof body.rememberMe !== "boolean") {
    errors.rememberMe = "Remember me must be true or false when provided.";
  }

  return errors;
}

export async function register(req, res, next) {
  const errors = validateCredentials(req.body, { registration: true });
  if (Object.keys(errors).length) {
    return validationError(res, "Registration details are invalid.", errors);
  }

  try {
    const user = await createUser(req.body);
    const token = signUserToken(user);
    return res.status(201).json({ token, user });
  } catch (error) {
    if (error instanceof DuplicateUsernameError) {
      return res.status(409).json({
        error: {
          code: "USERNAME_EXISTS",
          message: error.message,
          details: { username: "Already registered." },
        },
      });
    }
    return next(error);
  }
}

export async function login(req, res, next) {
  const errors = validateCredentials(req.body);
  if (Object.keys(errors).length) {
    return validationError(res, "Login details are invalid.", errors);
  }

  try {
    const user = await verifyCredentials(req.body.username, req.body.password);
    if (!user) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "The username or password is incorrect.",
          details: {},
        },
      });
    }

    const token = signUserToken(user, { rememberMe: req.body.rememberMe === true });
    return res.json({ token, user });
  } catch (error) {
    return next(error);
  }
}

export function currentUser(req, res) {
  return res.json(req.user);
}
