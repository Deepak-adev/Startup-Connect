package com.startupconnect.backend.controllers;

import com.startupconnect.backend.model.Startup;
import com.startupconnect.backend.repository.StartupRepository;
import com.startupconnect.backend.services.BroadcasterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/startups")
@CrossOrigin(origins = "*")
public class StartupController {

    private final StartupRepository startupRepository;
    private final BroadcasterService broadcasterService;

    public StartupController(StartupRepository startupRepository, BroadcasterService broadcasterService) {
        this.startupRepository = startupRepository;
        this.broadcasterService = broadcasterService;
    }

    @GetMapping
    public List<Startup> getAllStartups(@RequestParam(required = false) String industry) {
        if (industry != null && !industry.trim().isEmpty() && !"All".equalsIgnoreCase(industry)) {
            return startupRepository.findByIndustryIgnoreCase(industry);
        }
        return startupRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Startup> getStartupById(@PathVariable String id) {
        return startupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Startup createStartup(@RequestBody Startup startup) {
        if (startup.getMatchScore() == 0) {
            startup.setMatchScore((int) (Math.random() * 20) + 80);
        }
        Startup saved = startupRepository.save(startup);

        // Real-time asynchronous broadcast to all connected clients
        broadcasterService.broadcastStartupCreated(saved);

        return saved;
    }
}
