import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Initialize Gemini on server lazily inside endpoints or helpers to support fully dynamic secret loads
function getGeminiClient(): GoogleGenAI {
  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    throw new Error("Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in the Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey: currentApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing parser
  app.use(express.json());

  // API Route: Chat with AI Assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Messages array is required." });
        return;
      }

      // Initialize Gemini Client lazily inside handler to avoid startup crashes if missing and enable responsive recovery
      let aiClient;
      try {
        aiClient = getGeminiClient();
      } catch (initErr: any) {
        res.status(500).json({
          error: initErr?.message || "Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in the Secrets panel."
        });
        return;
      }

      // Filter out messages to ensure the conversation starts with a 'user' turn (Gemini API requirement)
      const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
      const conversationSubset = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

      // System instructions explaining Apex & Blade Barbershop context
      const systemInstruction = `You are "Astell", the sophisticated digital concierge & virtual receptionist for "Apex & Blade" Premium Barbershop located in Gaithersburg, MD.
Your tone is clean, respectful, welcoming, helpful, and sophisticated. Keep your replies concise, elegant, structured, and easy to read.

Here is the full authentic context of Apex & Blade:
- Store Name: Apex & Blade
- Tagline: Gaithersburg's Premier Grooming Lounge
- Address: 202 Perry Pkwy, Suite 4, Gaithersburg, MD 20877 (plenty of storefront parking, wheelchair accessible)
- Phone: (301) 555-8732
- Email: info@apexandblade.com
- Hours of Service:
  * Monday - Friday: 9:00 AM - 8:00 PM
  * Saturday: 9:00 AM - 6:00 PM
  * Sunday: 10:00 AM - 4:00 PM

Our Master Barbers & Artisans:
1. Marcus Vance: Master Barber & Founder. 12+ years experience. Specializes in precision master shears, classic-modern style transitions, and structural facial consulting. Available Mon-Sat.
2. Sarah Lin: Shave Specialist & Stylist. Master of straight-razor Royal wet shaves, detailed beard sculpting, and customized restorative skin therapies. Available Tue-Sun.
3. Julian Gray: Modern Hair Architect. Excels at modern textured crops, flawless skin level transitions (skin fades), and progressive styles. Available Wed-Mon.

Our Services Menu:
- Haircuts:
  * Classic Refined Cut: $45 (30 mins). Detailed haircut, neck shave clean-up, hot towel finish, luxury pomade.
  * The Executive Style & Steam: $65 (45 mins). Signature modern cut, deep conditioning hair wash, scalp massage, warm neck face shave, full blow-dry.
  * Skin Fade & Edge Out: $50 (45 mins). Crisp, ultra-clean zero or skin-level fade using professional clippers and straight-razor detailing.
  * Neat Buzz Cut: $30 (20 mins). Single-guard clipper fade with a hot towel finish.
- Royal Shaves & Beard Sculpting:
  * Royal Hot Towel Shave: $55 (45 mins). Traditional straight-edge razor wet shave, pre-shave steam, face massage, and cooling stone soothe.
  * Beard Sculpt & Crisp Edge: $35 (30 mins). Detailed beard shaping, length trimming, straight-razor cheek/neck edge alignment, and organic beard oil treatment.
  * The Classic Beard Setup: $25 (20 mins). Clipper trim with clean neck lines and refreshing hydration mist.
- Skin & Scalp Therapies:
  * Charcoal Face Revival Mask: $25 (20 mins). Pore-clearing black charcoal mask, warm facial steam, botanical age-defying moisturizer.
  * Scalp Therapy Massage & Wash: $20 (15 mins). Tea tree oil scalp detox, deep hand massage, moisturizing clarifying wash.
  * The Complete Grooming Package: $110 (75 mins). Combines 'The Executive Style', 'Beard Sculpt', and a mini-facial, with a complimentary organic espresso or craft drink.

Booking Process:
Clients can book appointments directly via our interactive "Fast Desk Reservation" panel on the right side of our homepage! They can select desired services, assign a dedicated barber (or choose 'any available' to auto-assign), scroll through the visual 7-day calendar, pick a time slot, and input their contact details. There is absolutely no pre-payment required. Payment is processed inside the lounge after they are pampered.

Complimentary Offerings:
Every booking includes high-quality curated beverages including organic espresso, hand-brewed coffee, and custom draft craft beverages.

Rules:
1. If the user asks about prices or duration, refer strictly to the above prices and times.
2. If they ask about booking or scheduling, guide them politely to use the "Fast Desk Reservation" calendar widget on the right side of the screen.
3. Always maintain the "Astell" persona. Be refined and charming. Avoid lengthy boilerplate explanations. Keep paragraphs short (2-3 sentences max) and use bullet points for lists.`;

      // Map client-side messages to GoogleGenAI expected user / model content parts
      const contents = conversationSubset.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      let modelResponse;
      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting chat generation using model: ${modelName}`);
          modelResponse = await aiClient.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });
          if (modelResponse && modelResponse.text) {
            console.log(`Successfully generated response using model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} encountered an error:`, err?.message || err);
          lastError = err;
        }
      }

      if (!modelResponse) {
        res.status(503).json({
          error: lastError?.message || "Astell is currently experiencing high service demand. Please wait a moment and try again."
        });
        return;
      }

      const responseText = modelResponse.text || "I apologize, but I was unable to generate a response. Please try again soon.";
      res.json({ content: responseText });
    } catch (error: any) {
      console.error("Gemini Chat Route Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // API Route: AI Haircut Visualizer
  app.post("/api/visualize-haircut", async (req, res) => {
    try {
      const { faceTemplate, styleName, color, addon, customPrompt, clientPhoto } = req.body;

      // Construct a premium descriptive prompt
      let basePrompt = "";
      if (customPrompt && customPrompt.trim()) {
        basePrompt = clientPhoto
          ? `Render the uploaded person's face with a custom styled haircut: "${customPrompt}". `
          : `Close-up portrait photography of a professional model with a custom styled hair: "${customPrompt}". `;
      } else {
        basePrompt = clientPhoto
          ? `Render the uploaded person's face with a sharp, high-fashion "${styleName}" haircut. `
          : `Close-up portrait photography of a professional model with a sharp, high-fashion "${styleName}" haircut. `;
      }

      let likenessInstruction = clientPhoto 
        ? "Maintain the model's facial features, gender, age, identity, and jawline exactly as in the reference image. "
        : "";

      const prompt = `Photorealistic ${basePrompt} ${likenessInstruction}Hair dyed in beautiful ${color || "natural dark"} shade. Detailing: ${addon || "crisp edge contours"}. Background of an incredibly luxurious, dark wood modernist high-end barbershop lounge. Warm soft studio lighting, professional depth of field, detailed, cinematic look, sharp eyes, 8k resolution.`;

      console.log("Generating haircut simulation. Prompt:", prompt);

      // Lazy load Gemini Client to ensure recovery and avoid crashing if key is missing
      let aiClient;
      try {
        aiClient = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini is not configured. Falling back to pre-rendered simulations.");
        res.json({
          isMock: true,
          message: "No GEMINI_API_KEY detected in the Secrets panel. Activating pre-rendered high-fidelity graphics simulator.",
          prompt: prompt,
          usedClientPhoto: !!clientPhoto
        });
        return;
      }

      let base64Image = "";
      let usedModel = "gemini-2.5-flash-image";

      try {
        console.log("Attempting image synthesis with:", usedModel);
        
        // Build multimodal parts list
        const parts: any[] = [];
        if (clientPhoto) {
          const match = clientPhoto.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            const mimeType = match[1];
            const base64Data = match[2];
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            });
            console.log("Passed client uploaded image bytes with mime type:", mimeType);
          }
        }
        parts.push({ text: prompt });

        const response = await aiClient.models.generateContent({
          model: usedModel,
          contents: {
            parts: parts
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              base64Image = part.inlineData.data;
              break;
            }
          }
        }
      } catch (err: any) {
        console.warn(`Model ${usedModel} failed. Trying alternate generator...`, err?.message || err);
        
        // Imagen doesn't support image-to-image as easily inline, but let's try fallback if clientPhoto not provided or ignore parts
        try {
          usedModel = "imagen-3.0-generate-002";
          console.log("Attempting alternate image synthesis with:", usedModel);
          const response = await aiClient.models.generateImages({
            model: usedModel,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: "image/jpeg",
              aspectRatio: "1:1"
            }
          });

          if (response.generatedImages?.[0]?.image?.imageBytes) {
            base64Image = response.generatedImages[0].image.imageBytes;
          }
        } catch (subErr: any) {
          console.error("All server-side image models failed.", subErr?.message || subErr);
        }
      }

      if (base64Image) {
        res.json({
          isMock: false,
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
          usedModel: usedModel,
          prompt: prompt,
          usedClientPhoto: !!clientPhoto
        });
      } else {
        res.json({
          isMock: true,
          message: "High service load. Displaying professional style coordinates overlaid on coordinates.",
          prompt: prompt,
          usedClientPhoto: !!clientPhoto
        });
      }
    } catch (error: any) {
      console.error("AI Visualization route exception:", error);
      res.json({
        isMock: true,
        message: "Fallback processing activated successfully.",
        prompt: "Fallback mode",
        usedClientPhoto: !!req.body.clientPhoto
      });
    }
  });

  // Serve static assets and handle routing via Vite or statically
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully active on http://localhost:${PORT}`);
  });
}

startServer();
