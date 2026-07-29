package com.startupconnect.backend.orchestrator;

import com.startupconnect.backend.agents.logo.LogoAgentService;
import com.startupconnect.backend.agents.website.WebsiteAgentService;
import com.startupconnect.backend.services.market.MarketService;
import com.startupconnect.backend.services.matching.MatchingService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class WorkflowOrchestrator {

    private final GeminiClient geminiClient;
    private final LogoAgentService logoAgent;
    private final WebsiteAgentService websiteAgent;
    private final MatchingService matchingService;
    private final MarketService marketService;

    private static final String SYSTEM_INSTRUCTION = """
            You are AGUI (AI Graphical User Interface), the engine for "Startup Connect".
            Your goal is to translate user intent into structured JSON actions to drive the Angular UI.

            **The "Steering Wheel" (URL Schema)**
            You drive the website by outputting a JSON object.

            **A. Supported Views (view parameter)**
            - 'dashboard': Main hub, metrics, loan status.
            - 'partners': Collaboration matching table.
            - 'market_analysis': Charts and research.
            - 'startup_sale': Exit strategy and valuation.
            - 'pitch_deck': Deck creation tool.

            **B. Supported Filters (params)**
            - industry: string (e.g., 'textile', 'tech', 'agriculture')
            - funding_min: number
            - profit_status: 'profit' | 'loss' | 'break_even'
            - q: search query string
            - action: 'trigger_veo_video' | 'trigger_imagen_logo' | 'generate_deck' | 'generate_website'

            **Operational Rules**
            1. Intent First: If user wants to see partners, navigate there immediately.
            2. Silent Driving: Output JSON cleanly. 
            3. Missing Info: Default to a logical view (e.g. 'partners') and ask for details in the 'message' field.

            **Response Format (JSON ONLY)**
            {
              "thought": "Internal reasoning...",
              "navigation": {
                "path": "/dashboard", 
                "params": {
                  "view": "partners",
                  "industry": "..."
                },
                "hash": "..."
              },
              "message": "User facing message..."
            }

            DO NOT use Markdown code blocks. Output raw JSON.
            """;

    public WorkflowOrchestrator(GeminiClient geminiClient, 
                                LogoAgentService logoAgent, 
                                WebsiteAgentService websiteAgent, 
                                MatchingService matchingService, 
                                MarketService marketService) {
        this.geminiClient = geminiClient;
        this.logoAgent = logoAgent;
        this.websiteAgent = websiteAgent;
        this.matchingService = matchingService;
        this.marketService = marketService;
    }

    public Mono<String> processUserInput(String userInput) {
        // Construct the prompt mimicking the legacy system
        String fullPrompt = SYSTEM_INSTRUCTION + "\n\nUser Input: " + userInput;
        
        return geminiClient.generateContent(fullPrompt)
                .flatMap(geminiResponse -> {
                    // Extract the raw JSON
                    String cleanedResponse = geminiResponse.replace("```json", "").replace("```", "").trim();
                    
                    // In the future, we can parse this JSON to conditionally trigger LogoAgent or MatchingService
                    // based on navigation.params.action or navigation.params.view.
                    // For now, we return the structured JSON directly to the frontend socket, just like the old AGUI.
                    return Mono.just(cleanedResponse);
                });
    }
}
