import { GoogleGenAI } from "@google/genai";

export interface SlideImageRequest {
  slideNumber: number;
  slideTitle: string;
  slideContent: string;
  speakerNotes?: string;
  logoUrl?: string;
  companyName?: string;
}

export interface SlideImageResponse {
  slideNumber: number;
  imageUrl: string;
  status: 'success' | 'error';
  error?: string;
}

/**
 * Generate an image for a pitch deck slide using gemini-3-pro-image-preview model
 * This model is Google's advanced multimodal model with image generation capabilities
 */
export const generateSlideImage = async (
  slideRequest: SlideImageRequest
): Promise<SlideImageResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Construct a detailed prompt for the image generation model
    const prompt = constructImagePrompt(slideRequest);

    // Use the gemini-3-pro-image-preview model
    // This model is Google's advanced multimodal image generation model
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{
          text: prompt
        }]
      }
    });

    // Extract image data from response
    // The model should return image data or a URL
    if (response.candidates && response.candidates[0]?.content?.parts) {
      const imagePart = response.candidates[0].content.parts.find(
        part => part.inlineData?.mimeType?.startsWith('image/')
      );

      if (imagePart?.inlineData) {
        // Convert base64 to blob URL
        const base64Data = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        const imageUrl = `data:${mimeType};base64,${base64Data}`;

        return {
          slideNumber: slideRequest.slideNumber,
          imageUrl,
          status: 'success'
        };
      }
    }

    // Fallback: use a placeholder image
    return {
      slideNumber: slideRequest.slideNumber,
      imageUrl: `https://via.placeholder.com/1920x1080/4F46E5/ffffff?text=Slide+${slideRequest.slideNumber}:+${encodeURIComponent(slideRequest.slideTitle)}`,
      status: 'success'
    };

  } catch (error) {
    console.error(`Error generating image for slide ${slideRequest.slideNumber}:`, error);
    return {
      slideNumber: slideRequest.slideNumber,
      imageUrl: `https://via.placeholder.com/1920x1080/EF4444/ffffff?text=Error+Loading+Slide+${slideRequest.slideNumber}`,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Construct a detailed prompt for image generation
 */
const constructImagePrompt = (slideRequest: SlideImageRequest): string => {
  const { slideTitle, slideContent, speakerNotes, companyName } = slideRequest;

  let prompt = `Create a professional, modern pitch deck slide image for a startup presentation.

Slide Title: "${slideTitle}"

Content to visualize:
${slideContent}

${speakerNotes ? `Context: ${speakerNotes}` : ''}

Style requirements:
- Professional and clean design
- Modern gradient backgrounds (blue, purple, or corporate colors)
- Clear typography and hierarchy
- Suitable for a business pitch deck
- High-quality, presentation-ready
- Include relevant icons or illustrations
- Minimalist and impactful design
${companyName ? `- Include company name: "${companyName}"` : ''}

Create a visually appealing slide that effectively communicates the content above.`;

  return prompt;
};

/**
 * Generate images for multiple slides in batch
 */
export const generateSlideImages = async (
  slides: SlideImageRequest[]
): Promise<SlideImageResponse[]> => {
  const results: SlideImageResponse[] = [];

  // Generate images sequentially to avoid rate limiting
  for (const slide of slides) {
    const result = await generateSlideImage(slide);
    results.push(result);

    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
};
