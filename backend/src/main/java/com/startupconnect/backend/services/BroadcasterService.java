package com.startupconnect.backend.services;

import com.corundumstudio.socketio.SocketIOServer;
import com.startupconnect.backend.model.PartnerConnection;
import com.startupconnect.backend.model.Startup;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class BroadcasterService {

    private final SocketIOServer socketIOServer;

    public BroadcasterService(SocketIOServer socketIOServer) {
        this.socketIOServer = socketIOServer;
    }

    @Async("taskExecutor")
    public void broadcastStartupCreated(Startup startup) {
        System.out.println("[ASYNC BROADCAST] Broadcasting new startup created across all clients: " + startup.getName());
        socketIOServer.getBroadcastOperations().sendEvent("startupCreated", startup);
    }

    @Async("taskExecutor")
    public void broadcastPartnerConnected(PartnerConnection connection) {
        System.out.println("[ASYNC BROADCAST] Broadcasting partner connection across all clients: " + connection.getPartnerName());
        socketIOServer.getBroadcastOperations().sendEvent("partnerConnected", connection);
    }

    @Async("taskExecutor")
    public void broadcastAGUINavigation(Object navigationData) {
        System.out.println("[ASYNC BROADCAST] Broadcasting AGUI navigation update");
        socketIOServer.getBroadcastOperations().sendEvent("chatReply", navigationData);
    }
}
