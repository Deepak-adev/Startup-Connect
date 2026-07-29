package com.startupconnect.backend.agents.website;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class WebsiteAgentService {

    public Mono<String> generateWebsite(String context) {
        // Mock website generation
        String response = String.format("{\"type\": \"website\", \"url\": \"http://mock-website.local\", \"message\": \"I have generated a starter webpage for your business based on: %s\"}", context);
        return Mono.just(response);
    }
}
