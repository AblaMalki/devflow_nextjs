import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // Validate API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is missing. Please set it in the environment variables."
      );
    }

    // Parse and validate request payload
    const { question } = await request.json();
    if (!question) {
      throw new Error("The 'question' field is required in the request body.");
    }

    // Make API request to OpenAI
    const apiResponse = await fetch(
      //   "https://api.openai.com/v1/chat/completions",
      "https://api.pawan.krd/pai-001-rp/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an insightful and highly knowledgeable assistant dedicated to delivering accurate, comprehensive, and high-quality information in a clear and helpful manner.",
            },
            {
              role: "user",
              content: `Tell me ${question}`,
            },
          ],
        }),
      }
    );

    // Handle response and errors
    if (!apiResponse.ok) {
      const errorDetails = await apiResponse.json();
      throw new Error(
        `OpenAI API error: ${
          errorDetails.error?.message || apiResponse.statusText
        }`
      );
    }

    const responseData = await apiResponse.json();
    const reply = responseData.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("OpenAI API returned an unexpected response format.");
    }

    // Return the reply to the client
    return NextResponse.json({ reply });
  } catch (error: any) {
    // Return a consistent error response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
