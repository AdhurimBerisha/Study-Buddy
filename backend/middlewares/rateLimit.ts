import rateLimit from "express-rate-limit";

const isDevelopment = process.env.NODE_ENV === "development";

export const authRateLimit = rateLimit({
  windowMs: isDevelopment ? 5 * 60 * 1000 : 15 * 60 * 1000,
  max: isDevelopment ? 20 : 5,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    if (isDevelopment) {
      res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Rate limit: ${
          isDevelopment
            ? "20 attempts per 5 minutes"
            : "5 attempts per 15 minutes"
        }. Please wait ${
          isDevelopment ? "5" : "15"
        } minutes or restart the server.`,
        retryAfter: isDevelopment ? 5 : 15,
        environment: isDevelopment ? "development" : "production",
      });
    } else {
      res.status(429).json({
        success: false,
        message: "Too many authentication attempts, please try again later",
      });
    }
  },
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const profileUpdateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many profile update attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
