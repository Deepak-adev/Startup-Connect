package com.startupconnect.backend.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SocketIOServerRunner implements CommandLineRunner, DisposableBean {

    private final SocketIOServer server;

    public SocketIOServerRunner(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        server.start();
        System.out.println("Socket.IO server started on port " + server.getConfiguration().getPort());
    }

    @Override
    public void destroy() throws Exception {
        server.stop();
        System.out.println("Socket.IO server stopped.");
    }
}
