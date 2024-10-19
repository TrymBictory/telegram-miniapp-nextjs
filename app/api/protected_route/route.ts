import { NextResponse, NextRequest } from "next/server";
import { authenticate } from "./../middleware/auth";

export async function GET(req: NextRequest) {
  const auth = authenticate(req);

  if (auth !== true) {
    return auth; // Return the response from the authentication check
  }

  const userId = (req as any).user.id;

  return NextResponse.json({ message: "Access granted", userId });
}
