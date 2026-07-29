package com.startupconnect.backend.services.market;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MarketService {

    public Mono<String> getInsights(String industry) {
        // Mock market insights
        String response = String.format("{\"type\": \"insight\", \"trends\": [\"AI Automation\", \"Sustainable Packaging\"], \"message\": \"Here are the latest trends for the %s industry.\"}", industry);
        return Mono.just(response);
    }
}
