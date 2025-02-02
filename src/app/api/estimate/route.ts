import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const { chunks, time } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a tool estimating the best timing for a speech.",
      },
      {
        role: "user",
        content:
          `We have exactly ${time} (minutes:seconds) to do this presentation. Estimate when each string should be finished. Divide the time equally across all non-empty strings, and provide the **end time** for each one, calculated cumulatively. Do not skip any non-empty string. The result should strictly follow this JSON format: [{id: 'id', time: 'time'}].` +
          "Ignore empty strings. Do not add any explanation, JSON syntax like '```json', or extra comments. This is the array of strings: " +
          `${chunks}`,
      },
    ],
  });

  const estimatedTime = JSON.parse(
    completion.choices[0].message.content || "[]"
  );

  return Response.json({ estimatedTime });
}
