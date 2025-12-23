import rateLimit from "express-rate-limit";

export const generalRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "Too many requests - Please wait for 1 minute !",
    standardHeaders: true,
    legacyHeaders: false
})