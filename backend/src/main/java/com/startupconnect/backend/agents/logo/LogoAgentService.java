package com.startupconnect.backend.agents.logo;

import com.startupconnect.backend.orchestrator.GeminiClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class LogoAgentService {

    private final GeminiClient geminiClient;

    public LogoAgentService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public Mono<String> generateLogo(String slideTitle, String slideContent) {
        String prompt = "Create a professional, modern pitch deck slide image for a startup presentation.\n\n" +
                "Slide Title: \"" + slideTitle + "\"\n\n" +
                "Content to visualize:\n" + slideContent + "\n\n" +
                "Style requirements:\n" +
                "- Professional and clean design\n" +
                "- Modern gradient backgrounds (blue, purple, or corporate colors)\n" +
                "- Clear typography and hierarchy\n" +
                "- Suitable for a business pitch deck\n" +
                "- High-quality, presentation-ready\n" +
                "- Include relevant icons or illustrations\n" +
                "- Minimalist and impactful design\n\n" +
                "Create a visually appealing slide that effectively communicates the content above.";

        // Real implementation would parse the base64 inlineData, but since we are mocking the Gemini 
        // image output for now as text, we'll return the fallback logic from the old TS codebase.
        return Mono.just("{\"type\": \"logo\", \"url\": \"https://via.placeholder.com/1920x1080/4F46E5/ffffff?text=" + slideTitle.replace(" ", "+") + "\", \"status\": \"success\"}");
    }
}
