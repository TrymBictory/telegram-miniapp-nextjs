import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";

// Middleware function to verify token and wrap API handlers
export function verifyToken(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Assuming the token is sent in the Authorization header as 'Bearer <token>'
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authentication token found" });
      }

      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };

      // Attach user data to the request
      (req as any).user = decoded; // Use type assertion for TypeScript

      // If the token is valid, call the actual API handler
      return handler(req, res);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}
