package com.startupconnect.backend.services.matching;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ChromaDBClient {

    private final WebClient webClient;

    public ChromaDBClient(WebClient.Builder webClientBuilder, @Value("${chromadb.url}") String chromaUrl) {
        this.webClient = webClientBuilder.baseUrl(chromaUrl).build();
    }

    public Mono<String> ping() {
        return this.webClient.get()
                .uri("/api/v1/heartbeat")
                .retrieve()
                .bodyToMono(String.class);
    }
    
    // Additional methods for querying collections and adding documents will go here
}
