import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Message received from Telegram:", body);

  const chatId = body.message.chat.id;
  
  const payload = {
    chat_id: chatId,
    text: 'Click the button below to launch the mini app:',
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Launch Mini App',
                    web_app : {
                      url: "https://en.wikipedia.org/wiki/Happiness" 
                    }
                    // Link to your mini app
                }
            ]
        ]
    }
};

  // Respond to Telegram
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return NextResponse.json({ status: "ok" });
}
