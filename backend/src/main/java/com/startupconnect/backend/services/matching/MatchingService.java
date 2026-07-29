package com.startupconnect.backend.services.matching;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
public class MatchingService {

    private final ChromaDBClient chromaDBClient;

    public MatchingService(ChromaDBClient chromaDBClient) {
        this.chromaDBClient = chromaDBClient;
    }

    private double calculateIndustryMatch(String startupIndustry, String partnerIndustry) {
        if (startupIndustry.equalsIgnoreCase(partnerIndustry)) {
            return 1.0;
        }
        
        Map<String, List<String>> relatedIndustries = Map.of(
            "technology", List.of("software", "fintech", "healthtech", "edtech"),
            "manufacturing", List.of("textile", "automotive", "electronics"),
            "retail", List.of("ecommerce", "fashion", "consumer goods"),
            "agriculture", List.of("food processing", "agritech"),
            "healthcare", List.of("pharmaceuticals", "medical devices"),
            "finance", List.of("banking", "insurance", "investment")
        );

        for (Map.Entry<String, List<String>> entry : relatedIndustries.entrySet()) {
            if (entry.getValue().contains(startupIndustry.toLowerCase()) && 
                entry.getValue().contains(partnerIndustry.toLowerCase())) {
                return 0.7;
            }
        }
        return 0.3;
    }

    public Mono<String> findMatch(String startupIndustry) {
        // Here we simulate the rest of the scoring logic from partnerMatching.ts
        // In a real scenario, we'd pull "partners" from ChromaDB and score them.
        double score = calculateIndustryMatch(startupIndustry, "software") * 100;
        
        String response = String.format("{\"type\": \"match\", \"matches\": [\"Tech Partner (Score: %.1f)\"], \"message\": \"I found a matching partner based on your industry.\"}", score);
        return Mono.just(response);
    }
}
