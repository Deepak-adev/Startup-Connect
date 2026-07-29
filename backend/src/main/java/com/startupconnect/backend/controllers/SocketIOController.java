package com.startupconnect.backend.controllers;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.startupconnect.backend.orchestrator.WorkflowOrchestrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SocketIOController {

    private final SocketIOServer server;
    private final WorkflowOrchestrator orchestrator;

    @Autowired
    public SocketIOController(SocketIOServer server, WorkflowOrchestrator orchestrator) {
        this.server = server;
        this.orchestrator = orchestrator;
        this.server.addListeners(this);
    }

    @OnConnect
    public void onConnect(SocketIOClient client) {
        System.out.println("Client connected: " + client.getSessionId());
    }

    @OnDisconnect
    public void onDisconnect(SocketIOClient client) {
        System.out.println("Client disconnected: " + client.getSessionId());
    }

    @OnEvent("chatMessage")
    public void onChatMessage(SocketIOClient client, String data, AckRequest ackRequest) {
        System.out.println("Received chat message: " + data);
        
        // Pass to Orchestrator, which parses intent and calls agents
        orchestrator.processUserInput(data).subscribe(
            response -> {
                client.sendEvent("chatReply", response);
            },
            error -> {
                System.err.println("Error processing message: " + error.getMessage());
                String errorJson = "{\"type\": \"error\", \"message\": \"I'm sorry, my neural link is currently down. (Check backend logs - possibly invalid API key or missing DB).\"}";
                client.sendEvent("chatReply", errorJson);
            }
        );
    }
}
