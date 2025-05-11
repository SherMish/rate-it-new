import { NextResponse } from "next/server";
import OpenAI from "openai";
import categoriesData from "@/lib/data/categories.json";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export const maxDuration = 30; // 30 seconds timeout

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === "true") {
    return new NextResponse("Not authorized", { status: 401 });
  }

  if (!PERPLEXITY_API_KEY) {
    console.error("Perplexity API key is not set");
    return new NextResponse("Perplexity API key is not configured", {
      status: 500,
    });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    const categoryOptions = Array.isArray(categoriesData.categories)
      ? categoriesData.categories.map((cat) => cat.id)
      : [];

    const payload = {
      model: "sonar-reasoning-pro",
      messages: [
        {
          role: "system",
          content: `RESPOND WITH ONLY A JSON OBJECT.
NO THINKING. NO EXPLANATIONS. NO MARKDOWN.
NO <think> TAGS. NO CODE FENCES.
NO ADDITIONAL TEXT BEFORE OR AFTER THE JSON.

FORMAT:
{
  "shortDescription": "string (10 words)",
  "description": "string (100 words)",
  "pricingModel": "string (one of: free, freemium, subscription, pay_per_use, enterprise)",
  "hasFreeTrialPeriod": boolean,
  "hasAPI": boolean,
  "launchYear": number or null,
  "category": "string (valid category ID)",
  "userReviewsScore": number (0-100) positive only,
  "featureRobustnessScore": number (0-100) positive only,
  "marketAdoptionScore": number (0-100) positive only,
  "pricingAccessibilityScore": number (0-100) positive only,
}`,
        },
        {
          role: "user",
          content: `Analyze the AI tool at ${url} using real-time web search. 

1) **User Reviews Score ("userReviewsScore" [0-100])**
   - Check **first, theresanaiforthat.com, later, G2, Trustpilot,  Product Hunt, Reddit, Twitter, etc.**
   - Count the number of reviews (higher = better).
   - Convert star ratings to a percentage.
   - Identify common praise/complaints.
   - Weight trusted platforms higher (G2 > random Reddit threads).
   - Normalize to a **0-100 scale**, where 100 represents excellent feedback, and 0 represents bad feedback or absolute lack of feedback.

2) **Feature Robustness Score ("featureRobustnessScore" [0-100])**
   - Check **Futurepedia, Product Hunt, company websites, etc.**
   - Identify standout AI capabilities, integrations, and automations.
   - Compare innovation to competitors.
   - Assign a **0-100 score** based on unique and advanced features.

3) **Market Adoption Score ("marketAdoptionScore" [0-100])**
   - Search for **media coverage, partnerships, and industry recognition**.
   - Look for user milestones (e.g., "1M users", "Top AI tool of 2024").
   - Identify brand presence in AI communities.
   - Score **higher for widely recognized and adopted tools**.

4) **Pricing Accessibility Score ("pricingAccessibilityScore" [0-100])**
   - Review pricing transparency on the official website.
   - Check if a **free plan or free trial** is available.
   - Compare costs with competitors in the same category.
   - Score **higher for clear, affordable, and accessible pricing**.


          Return JSON with:
{
  "shortDescription": "10-word summary",
  "description": "Generate a 100-word single-paragraph description of the given AI tool. Focus on its practical value for businesses and professionals. Clearly explain what it does, its core features. Keep the tone clear, informative, and professional—avoid excessive jargon, exaggerated claims, or unnecessary complexity. Do not mention star ratings, quotes, or comparisons to other platforms. Avoid pricing details or subjective opinions. Ensure the description is structured, engaging, and easy to understand.",
  "pricingModel": "one of [free, freemium, subscription, pay_per_use, enterprise]",
  "hasFreeTrialPeriod": true/false,
  "hasAPI": true/false,
  "launchYear": number or null,
  "category": "one ID from: ${JSON.stringify(categoryOptions)}",
  "userReviewsScore": number (0-100) NO NEGATIVE VALUES,
  "featureRobustnessScore": number (0-100) NO NEGATIVE VALUES,
  "marketAdoptionScore": number (0-100) NO NEGATIVE VALUES,
  "pricingAccessibilityScore": number (0-100) NO NEGATIVE VALUES,
}`,
        },
      ],
      max_tokens: 2500,
      temperature: 0.6,
      top_p: 0.3,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "year",
      top_k: 5,
      stream: false,
      frequency_penalty: 0.5,
    };

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("🔍 Perplexity Response:", response);
    if (response.status !== 200) {
      console.error(`Perplexity API error: ${response.statusText}`);
      return new NextResponse("Perplexity API error", { status: 500 });
    }
    const data = await response.json();

    let content = data.choices[0].message.content;
    console.log("🔍 AI Response:", content);

    const prompt = `return JSON response with the following fields:
    shortDescription: 10-word summary,
    description: Generate a 100-word single-paragraph description of the given AI tool. Focus on its practical value for businesses and professionals. Clearly explain what it does, its core features. Keep the tone clear, informative, and professional—avoid excessive jargon, exaggerated claims, or unnecessary complexity. Do not mention star ratings, quotes, or comparisons to other platforms. Avoid pricing details or subjective opinions. Ensure the description is structured, engaging, and easy to understand.",
    pricingModel: "one of [free, freemium, subscription, pay_per_use, enterprise]",
    hasFreeTrialPeriod: true/false,
    hasAPI: true/false,
    launchYear: number or null,
    category: one ID from: ${JSON.stringify(categoryOptions)},
    userReviewsScore: number (0-100) positive only (Rely on the numbers in the texts, not the final json),
    featureRobustnessScore: number (0-100) positive only (Rely on the numbers in the texts, not the final json),
    marketAdoptionScore: number (0-100) positive only (Rely on the numbers in the texts, not the final json),
    pricingAccessibilityScore: number (0-100) positive only (Rely on the numbers in the texts, not the final json),
    radarTrustExplanation: single string (Explain for each score briefly in one paragraph),
    Get the data from here: ${content}.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Instruct GPT to output valid JSON by setting response_format to "json_object"
    const responseGPT = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_object",
      },
    });

    // GPT should return JSON in .choices[0].message.content
    const jsonResponse = responseGPT.choices[0].message.content;
    console.log("GPT Response:", jsonResponse);
    // Parse the JSON
    const parsedResponse = jsonResponse ? JSON.parse(jsonResponse) : {};

    // Safely extract needed fields (with defaults to avoid NaN)
    const {
      userReviewsScore = 70,
      featureRobustnessScore = 70,
      marketAdoptionScore = 70,
      pricingAccessibilityScore = 70,
      radarTrustExplanation = "",
    } = parsedResponse;

    // Compute normalized radarTrust (scaled 0-10)
    let radarTrust =
      (0.4 * userReviewsScore +
        0.3 * featureRobustnessScore +
        0.2 * marketAdoptionScore +
        0.1 * pricingAccessibilityScore) /
      10;

    radarTrust = parseFloat(radarTrust.toFixed(1));

    // Optionally refine or augment the explanation
    const finalExplanation =
      radarTrustExplanation ||
      `Based on weighted scoring: Reviews (${userReviewsScore}%), Features (${featureRobustnessScore}%), Market (${marketAdoptionScore}%), Pricing (${pricingAccessibilityScore}%).`;

    // Combine the original JSON with the computed radarTrust fields
    const returnObj = {
      ...parsedResponse,
      radarTrust,
      radarTrustExplanation: finalExplanation,
    };

    console.log("Final Return Object:", returnObj);

    // Return as JSON response
    return NextResponse.json(returnObj);
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return NextResponse.json(
      { error: "Failed to generate metadata" },
      { status: 500 }
    );
  }
}
