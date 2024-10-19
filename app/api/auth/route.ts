import { NextResponse, NextRequest } from "next/server"; // Import NextRequest and NextResponse
import jwt from "jsonwebtoken";
import { verifyTelegramAuth } from "@/utils/tgAuth";

// Set environment variables for JWT secret and expiry time
const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const TOKEN_MAX_AGE = 60 * 60 * 24; // 1 day

// API route for authenticating Telegram and returning JWT token
export async function POST(req: NextRequest) {
  try {
    const data: any = await req.json(); // Parse the incoming JSON body

    // Verify Telegram authentication
    const auth = verifyTelegramAuth(data); // Change this to sync since verifyTelegramAuth is not async

    if (!auth) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Create a JWT token with user info (e.g., userId, username)
    const token = jwt.sign(
      {
        id: data.id,
        username: data.username,
        exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE, // Token expires in 1 day
      },
      JWT_SECRET
    );

    // Return the token to the frontend
    return NextResponse.json({ message: "Authentication successful", token });
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
