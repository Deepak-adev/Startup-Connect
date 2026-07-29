package com.startupconnect.backend.orchestrator;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class GeminiClient {

    private final WebClient webClient;

    public GeminiClient(WebClient.Builder webClientBuilder, 
                        @Value("${gemini.api.url}") String apiUrl,
                        @Value("${gemini.api.key}") String apiKey) {
        // Appending the key as a query parameter as per Gemini API spec
        this.webClient = webClientBuilder.baseUrl(apiUrl + "?key=" + apiKey).build();
    }

    public Mono<String> generateContent(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            }
        );

        return this.webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}
