import { GoogleGenAI } from "@google/genai";

/**
 * Veo Video Generation Service
 *
 * IMPORTANT: Video generation with Google Veo requires specific SDK support.
 *
 * Current Status:
 * - The @google/genai package (v0.14.0) may not have full Veo video generation support
 * - Veo models require the generateVideos() API method (not generateContent())
 * - Video generation is a long-running operation that requires polling
 *
 * Available Model Names to Try:
 * - veo-3.0-generate-preview
 * - veo-3.1-generate-preview
 * - veo-3.0-fast-generate-preview
 *
 * Alternative Approaches:
 * 1. Install @google/generative-ai package alongside @google/genai
 * 2. Use the REST API directly with fetch()
 * 3. Wait for @google/genai to add video generation support
 *
 * To verify available models, check console logs when generateVideo() is called.
 */

/**
 * List all available models to help debug what's available
 * This can help identify the correct model names and supported methods
 */
export const listAvailableModels = async (): Promise<any[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Try to list models if the method exists
    if ('listModels' in ai && typeof (ai as any).listModels === 'function') {
      const models = await (ai as any).listModels();
      console.log('Available models:', models);
      return models;
    } else if ('models' in ai && 'list' in (ai as any).models) {
      const models = await (ai as any).models.list();
      console.log('Available models:', models);
      return models;
    }

    console.warn('No listModels method found on GoogleGenAI instance');
    return [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number; // Duration in seconds
  aspectRatio?: '16:9' | '9:16' | '1:1';
  companyName?: string;
  script?: string;
}

export interface VideoGenerationResponse {
  videoUrl?: string;
  audioUrl?: string;
  status: 'success' | 'processing' | 'error';
  error?: string;
  jobId?: string;
}

/**
 * Generate a video using Google's Veo 3.0 Fast model
 * Uses veo-3.0-fast-generate-preview for video generation
 *
 * Note: Video generation with Veo requires the long-running operation API
 * which may take several minutes to complete. The function will poll for results.
 */
export const generateVideo = async (
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // List available models for debugging (only on first call)
    if (!process.env.MODELS_LISTED) {
      console.log('Checking available models...');
      await listAvailableModels();
      (process.env as any).MODELS_LISTED = 'true';
    }

    // Construct video generation prompt
    const videoPrompt = constructVideoPrompt(request);

    console.log('Generating video with Veo 3.0 Fast model...', videoPrompt);

    // Check if video generation API is available
    if (!ai.models || typeof (ai.models as any).generateVideos !== 'function') {
      console.warn('Video generation API not available in @google/genai package');
      return {
        status: 'error',
        error: 'Video generation is not available yet. The Veo API requires additional setup or a different SDK version. Please install @google/generative-ai package for video generation support.'
      };
    }

    // Try using the models.generateVideos API if available in @google/genai
    // Note: Veo video generation is limited to 8 seconds
    // Use the SDK-native format (NOT REST API format with instances/parameters)
    const videoRequest = {
      model: 'veo-3.1-generate-preview',
      prompt: videoPrompt,
      config: {
        aspectRatio: request.aspectRatio || '16:9',
        numberOfVideos: 1
      }
    };

    console.log('Video request:', JSON.stringify(videoRequest, null, 2));

    const operation = await (ai.models as any).generateVideos(videoRequest);

    console.log('Veo operation received:', operation);
    console.log('Operation type:', typeof operation);

    // Deep inspect the response structure
    if (operation && typeof operation === 'object') {
      console.log('Operation keys:', Object.keys(operation));
      console.log('Operation constructor:', operation.constructor?.name);

      // Log all properties for debugging
      for (const key of Object.keys(operation)) {
        console.log(`  ${key}:`, typeof operation[key], operation[key]);
      }
    }

    // Handle null or undefined response
    if (!operation || typeof operation !== 'object') {
      throw new Error('Received invalid response from Veo API. Response type: ' + typeof operation);
    }

    // Helper function to extract video from result
    const extractVideo = (result: any): VideoGenerationResponse | null => {
      console.log('Extracting video from result:', result);

      // Check for generatedVideos array (SDK format)
      if (result?.generatedVideos?.[0]) {
        const video = result.generatedVideos[0];
        console.log('Found generatedVideos:', video);

        if (video.video?.uri) {
          return { videoUrl: video.video.uri, status: 'success' };
        }
        if (video.uri) {
          return { videoUrl: video.uri, status: 'success' };
        }
      }

      // Check for videos array
      if (result?.videos?.[0]) {
        const video = result.videos[0];
        if (video.url) {
          return { videoUrl: video.url, status: 'success' };
        }
        if (video.uri) {
          return { videoUrl: video.uri, status: 'success' };
        }
        if (video.data) {
          const blob = new Blob(
            [Uint8Array.from(atob(video.data), c => c.charCodeAt(0))],
            { type: video.mimeType || 'video/mp4' }
          );
          return { videoUrl: URL.createObjectURL(blob), status: 'success' };
        }
      }

      return null;
    };

    // Case 1: Operation has a result() method (async operation pattern)
    if (typeof operation.result === 'function') {
      console.log('Operation has result() method, awaiting...');
      const result = await operation.result();
      console.log('Result from operation.result():', result);

      const video = extractVideo(result);
      if (video) return video;
    }

    // Case 2: Operation has a wait() method
    if (typeof operation.wait === 'function') {
      console.log('Operation has wait() method, awaiting...');
      const result = await operation.wait();
      console.log('Result from operation.wait():', result);

      const video = extractVideo(result);
      if (video) return video;
    }

    // Case 3: Operation needs polling via poll() method
    if (typeof operation.poll === 'function') {
      console.log('Polling operation...');
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        const status = await operation.poll();
        console.log(`Poll attempt ${attempts + 1}:`, status);

        if (status.done || status.complete) {
          const video = extractVideo(status.response || status.result || status);
          if (video) return video;
          throw new Error('No video data in completed operation');
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      throw new Error('Video generation timed out after 5 minutes');
    }

    // Case 4: Response already contains video data directly
    const directVideo = extractVideo(operation);
    if (directVideo) return directVideo;

    // Case 5: Check for nested operation property
    if (operation.operation) {
      console.log('Found nested operation, processing...');
      const nestedResult = await (typeof operation.operation.result === 'function'
        ? operation.operation.result()
        : operation.operation);
      const video = extractVideo(nestedResult);
      if (video) return video;
    }

    // Case 6: Operation returns just a name string - need to poll via REST API
    if (operation.name && typeof operation.name === 'string') {
      console.log('Got operation name, polling via REST API:', operation.name);

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max (5 sec intervals)

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling operation (${attempts}/${maxAttempts})...`);

        // Poll the operation status via REST API
        const pollResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${operation.name}?key=${apiKey}`
        );

        if (!pollResponse.ok) {
          const errorText = await pollResponse.text();
          console.error('Poll error:', pollResponse.status, errorText);
          throw new Error(`Failed to poll operation: ${pollResponse.status} ${errorText}`);
        }

        const pollResult = await pollResponse.json();
        console.log('Poll result:', pollResult);

        // Check if operation is done
        if (pollResult.done) {
          console.log('Operation completed!');

          // Check for error in response
          if (pollResult.error) {
            throw new Error(`Video generation failed: ${pollResult.error.message || JSON.stringify(pollResult.error)}`);
          }

          // Extract video from response
          const response = pollResult.response || pollResult.result;
          console.log('Full response object:', JSON.stringify(response, null, 2));

          if (response) {
            // Check for generateVideoResponse format (Veo API structure)
            const videoResponse = response.generateVideoResponse || response;
            console.log('Video response:', JSON.stringify(videoResponse, null, 2));

            // Check various response formats
            const videos = videoResponse.generatedVideos ||
                          videoResponse.videos ||
                          response.generatedVideos ||
                          response.videos ||
                          [];

            if (videos.length > 0) {
              const videoData = videos[0];
              console.log('Video data:', JSON.stringify(videoData, null, 2));

              // Get video URI/URL - check multiple possible locations
              const videoUri = videoData.video?.uri ||
                              videoData.video?.url ||
                              videoData.uri ||
                              videoData.url ||
                              videoData.videoUri;

              if (videoUri) {
                console.log('Found video URI:', videoUri);
                return { videoUrl: videoUri, status: 'success' };
              }

              // Handle base64 data
              const base64Data = videoData.video?.videoBytes ||
                                videoData.videoBytes ||
                                videoData.video?.data ||
                                videoData.data;

              if (base64Data) {
                console.log('Found base64 video data, converting to blob...');
                const mimeType = videoData.video?.mimeType || videoData.mimeType || 'video/mp4';
                const blob = new Blob(
                  [Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))],
                  { type: mimeType }
                );
                return { videoUrl: URL.createObjectURL(blob), status: 'success' };
              }

              // Log what we did find in videoData for debugging
              console.log('VideoData keys:', Object.keys(videoData));
              if (videoData.video) {
                console.log('videoData.video keys:', Object.keys(videoData.video));
              }
            } else {
              // No videos array found - log available keys
              console.log('No videos array found. Response keys:', Object.keys(response));
              if (response.generateVideoResponse) {
                console.log('generateVideoResponse keys:', Object.keys(response.generateVideoResponse));
              }
            }
          }

          throw new Error('Operation completed but no video data found in response. Check console logs for response structure.');
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      throw new Error('Video generation timed out after 5 minutes');
    }

    // If we get here, log the full structure for debugging
    console.error('Unable to extract video. Full operation structure:', JSON.stringify(operation, null, 2));
    throw new Error('No video data in Veo response. Check console for response structure.');

  } catch (error) {
    console.error('Error generating video with Veo 3.0:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error: ' + String(error)
    };
  }
};

/**
 * Generate audio narration using text-to-speech
 * Note: Gemini native audio is not available in the standard API
 * This returns a placeholder for now
 */
export const generateAudioNarration = async (
  _script: string,
  _voiceType: 'professional' | 'friendly' | 'energetic' = 'professional'
): Promise<VideoGenerationResponse> => {
  try {
    console.log('Audio narration requested but native audio model not available in current API version');

    // Native audio generation is not yet available in the public API
    // Return a status indicating this feature is coming soon
    return {
      status: 'error',
      error: 'Audio narration generation is not available yet. This feature requires API access to Gemini native audio models which are currently in preview.'
    };

  } catch (error) {
    console.error('Error in audio generation:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Audio generation not available'
    };
  }
};

/**
 * Generate both video and audio for a complete pitch deck presentation
 */
export const generatePitchDeckMedia = async (
  fullScript: string,
  companyName: string
): Promise<{ video: VideoGenerationResponse; audio: VideoGenerationResponse }> => {
  console.log('Generating complete pitch deck media with Veo...');

  // Generate video and audio in parallel
  const [video, audio] = await Promise.all([
    generateVideo({
      prompt: fullScript,
      companyName,
      script: fullScript,
      duration: 180, // 3 minutes
      aspectRatio: '16:9'
    }),
    generateAudioNarration(fullScript, 'professional')
  ]);

  return { video, audio };
};

/**
 * Construct a detailed prompt for Veo video generation
 */
const constructVideoPrompt = (request: VideoGenerationRequest): string => {
  const { prompt, companyName, aspectRatio = '16:9' } = request;

  // Note: Veo video generation is limited to 8 seconds
  // Keep the prompt concise and focused on a single impactful visual
  let videoPrompt = `Create an 8-second professional pitch deck intro video.

Main Topic: ${prompt}
${companyName ? `Company: ${companyName}` : ''}

Video Requirements:
- Duration: Exactly 8 seconds
- Aspect Ratio: ${aspectRatio}
- Style: Professional, modern, sleek corporate intro
- Smooth cinematic camera movement
- High-quality production values
- Dynamic and engaging visuals

Content: Show the company logo or name appearing with elegant animation, followed by a brief tagline or key visual representing the startup's vision. Use professional colors (blues, purples, or corporate palette) with smooth transitions and modern motion graphics.

Create a high-impact 8-second opener suitable for a startup pitch presentation.`;

  return videoPrompt;
};


/**
 * Check the status of a Veo video generation job
 * This would be used for asynchronous video generation
 */
export const checkVideoGenerationStatus = async (
  jobId: string
): Promise<VideoGenerationResponse> => {
  try {
    // In production, this would query the Veo API for job status
    console.log('Checking video generation status:', jobId);

    // Simulate status check
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      status: 'success',
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      jobId
    };

  } catch (error) {
    console.error('Error checking video status:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      jobId
    };
  }
};
