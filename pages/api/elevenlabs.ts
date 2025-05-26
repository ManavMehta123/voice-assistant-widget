import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { text } = req.body;
  const apiKey = process.env.ELEVEN_API_KEY!;
  const voiceId = process.env.ELEVEN_VOICE_ID!;

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Text-to-speech failed" });
  }

  const audioBuffer = await response.arrayBuffer();
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(Buffer.from(audioBuffer));
}