import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY;

// Helper to create a fresh client instance TATYA_IMG
const getAiClient = () => new GoogleGenAI({ apiKey });

/**
 * Generates a text response for a chat conversation.
 */
export const generateChatResponse = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  // The specific phrase requested by the user for irrelevant queries.
  const IRRELEVANT_PHRASE = "Ata tu padun raha, asl kahi hi nko vicharus...";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are Tatya Vinchu, a funny, mischievous, and slightly scary Indian puppet character. 
        
        Your rules:
        1. If the user asks something completely irrelevant, out of context, nonsense, or something you don't want to answer, you MUST respond EXACTLY with this Marathi phrase: "${IRRELEVANT_PHRASE}". Do not add anything else if you use this phrase.
        2. Otherwise, be funny, witty, and use 'Om Bhatt Swaha' occasionally in your sentences.
        3. Keep responses relatively short and chatty.
        `
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat generation error:", error);
    throw error;
  }
};

/**
 * Generates an image based on a text prompt using Imagen 3.
 */
export const generateImageFromText = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg'
      }
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) throw new Error("No image data returned");
    
    return imageBytes;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Modifies an existing image based on a text prompt using Gemini Flash Image.
 */
export const modifyImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE]
      }
    });

    // Extracting image from content parts
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return part.inlineData.data;
    }
    
    throw new Error("Failed to modify image: No image data in response");
  } catch (error) {
    console.error("Image modification error:", error);
    throw error;
  }
};










// import { GoogleGenAI, Modality } from "@google/genai";
// import { fal } from "@fal-ai/client";

// /* -----------------------------------------
//    ENV
// ----------------------------------------- */
// const apiKey = import.meta.env.VITE_API_KEY;
// const falKey = import.meta.env.VITE_FAL_KEY;

// fal.config({
//   credentials: falKey,
// });

// // Create new Gemini client instance
// const getAiClient = () => new GoogleGenAI({ apiKey });

// /* =========================================
//    1. CHAT RESPONSE
// ========================================= */

// export const generateChatResponse = async (prompt: string): Promise<string> => {
//   const ai = getAiClient();
//   const IRRELEVANT_PHRASE = "Ata tu padun raha, asl kahi hi nko vicharus...";

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//       config: {
//         systemInstruction: `
//           You are Tatya Vinchu, a funny, mischievous, and slightly scary Indian puppet character.

//           RULES:
//           1. If user asks anything irrelevant or nonsense → reply ONLY with: "${IRRELEVANT_PHRASE}"
//           2. Otherwise be funny, witty; add 'Om Bhatt Swaha' sometimes.
//           3. Keep answers short.
//         `,
//       },
//     });

//     return response.text || "I'm sorry, I couldn't generate a response.";
//   } catch (error) {
//     console.error("Chat generation error:", error);
//     throw error;
//   }
// };

// /* =========================================
//    2. TEXT → IMAGE using FAL + GPT description
// ========================================= */

// export const generateImageFromText = async (prompt: string): Promise<string> => {
//   try {
//     // 1️⃣ Generate image from Fal.ai
//     const result = await fal.subscribe("fal-ai/flux/dev", {
//       input: { prompt },
//       logs: false,
//     });

//     const imageUrl = result?.data?.images?.[0]?.url;

//     if (!imageUrl) throw new Error("Fal.ai did not return an image");

//     // 2️⃣ Generate short description using Gemini
//     const ai = getAiClient();
//     const descResponse = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `Write a short 1–2 sentence description of an image generated from this prompt: ${prompt}`,
//     });

//     const description =
//       descResponse.text || "Here is your generated image.";

//     // 3️⃣ Return as a combined string (UI-friendly)
//     return `${imageUrl}|||${description}`;
//   } catch (error) {
//     console.error("Text-to-image generation error:", error);
//     throw error;
//   }
// };

// /* =========================================
//    3. MODIFY EXISTING IMAGE (Gemini Flash)
// ========================================= */

// // NOTE: This function returns the Base64 image data string, 
// // which you must then display in your frontend (e.g., in an <img> tag).
// export const modifyImage = async (
//   base64Image: string,
//   prompt: string
// ): Promise<string> => {
//   const ai = getAiClient();

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-image", // Or gemini-2.5-flash
//       contents: {
//         parts: [
//           // Send the input image as inline data
//           { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
//           // Send the text prompt
//           { text: prompt },
//         ],
//       },
//       config: {
//         // Important: Request an image response modality
//         responseModalities: [Modality.IMAGE], 
//       },
//     });

//     // 🔑 CORRECT EXTRACTION LOGIC: Traverse the response to find the inlineData
//     const generatedImagePart = 
//         response.candidates?.[0]?.content?.parts?.find(
//             (part) => part.inlineData?.data && part.inlineData.mimeType.startsWith("image/")
//         );

//     if (generatedImagePart?.inlineData?.data) {
//       // The returned data is the raw base64 string of the modified image
//       return generatedImagePart.inlineData.data; 
//     }

//     throw new Error("Image modification failed: No image data returned in the response.");
//   } catch (error) {
//     console.error("Image modification error:", error);
//     throw error;
//   }
// };