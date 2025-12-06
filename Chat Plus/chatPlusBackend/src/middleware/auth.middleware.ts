import jwt from "jsonwebtoken";
import { ApiError } from "../helpers/apiError";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized - No token provided!");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        req.userId = decoded.id;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized - Invalid or Expired Token!");
    }
};
