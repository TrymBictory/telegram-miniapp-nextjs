import crypto from "crypto";

interface TelegramAuthData {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
  [key: string]: string | undefined; // allow additional fields like `photo_url` or `username`
}

export const verifyTelegramAuth = (authData: TelegramAuthData): boolean => {
  try {
    const { hash, ...dataToCheck } = authData;

    // 1. Sort the data and concatenate it, filtering out undefined values
    const dataString = Object.keys(dataToCheck)
      .sort()
      .map((key) => {
        const value = dataToCheck[key];
        return value ? `${key}=${value}` : null;
      })
      .filter(Boolean)
      .join("\n");

    // Check if dataString is valid
    if (!dataString) {
      throw new Error("Data string is undefined or empty");
    }

    // 2. Create a hash using your bot's token
    const secretKey = crypto
      .createHash("sha256")
      .update(process.env.BOT_TOKEN as string)
      .digest("hex");

    // 3. Generate an HMAC SHA-256 hash of the data string
    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataString)
      .digest("hex");

    // 4. Compare the hashes
    return computedHash === hash;
  } catch (e: any) {
    console.log(e.message, "error");
    return false;
  }
};
