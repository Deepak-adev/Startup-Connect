package com.startupconnect.backend.controllers;

import com.startupconnect.backend.model.PartnerConnection;
import com.startupconnect.backend.model.Startup;
import com.startupconnect.backend.repository.StartupRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/partners")
@CrossOrigin(origins = "*")
public class PartnerController {

    private final StartupRepository startupRepository;
    private final List<PartnerConnection> connections = new ArrayList<>();

    public PartnerController(StartupRepository startupRepository) {
        this.startupRepository = startupRepository;
    }

    @GetMapping("/match")
    public List<Map<String, Object>> getMatchingPartners(@RequestParam(defaultValue = "All") String industry) {
        List<Startup> startups;
        if ("All".equalsIgnoreCase(industry) || industry == null || industry.trim().isEmpty()) {
            startups = startupRepository.findAll();
        } else {
            startups = startupRepository.findByIndustryIgnoreCase(industry);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        
        // Base ecosystem partners
        List<Map<String, Object>> basePartners = List.of(
            Map.of(
                "id", "partner-tech-1",
                "name", "Tech Innovators Global",
                "industry", "Technology",
                "match", 98,
                "desc", "Specialized in cloud microservices and AI agent integrations for B2B platforms.",
                "verified", true,
                "location", "San Francisco, CA"
            ),
            Map.of(
                "id", "partner-clean-2",
                "name", "EcoGrid Ventures",
                "industry", "CleanTech",
                "match", 94,
                "desc", "Renewable energy equipment distribution and smart-meter grid software integration.",
                "verified", true,
                "location", "Austin, TX"
            ),
            Map.of(
                "id", "partner-health-3",
                "name", "Acme Health Systems",
                "industry", "Healthcare",
                "match", 91,
                "desc", "Hospital distribution network with active digital health co-investment fund.",
                "verified", true,
                "location", "Boston, MA"
            ),
            Map.of(
                "id", "partner-fin-4",
                "name", "Apex Global Capital",
                "industry", "Fintech",
                "match", 96,
                "desc", "Institutional liqudity & automated banking API sandbox for scaling startups.",
                "verified", true,
                "location", "New York, NY"
            )
        );

        for (Map<String, Object> p : basePartners) {
            String pInd = (String) p.get("industry");
            if ("All".equalsIgnoreCase(industry) || pInd.equalsIgnoreCase(industry)) {
                Map<String, Object> copy = new HashMap<>(p);
                copy.put("connected", isConnected((String) p.get("id")));
                result.add(copy);
            }
        }

        // Convert MongoDB startups to potential partner matches as well
        for (Startup s : startups) {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("id", s.getId() != null ? s.getId() : s.getName().toLowerCase().replace(" ", "-"));
            pMap.put("name", s.getName() + " (Ecosystem)");
            pMap.put("industry", s.getIndustry());
            pMap.put("match", s.getMatchScore() > 0 ? s.getMatchScore() : 89);
            pMap.put("desc", s.getDescription());
            pMap.put("verified", false);
            pMap.put("location", s.getLocation() != null ? s.getLocation() : "Remote");
            pMap.put("connected", isConnected((String) pMap.get("id")));
            result.add(pMap);
        }

        return result;
    }

    @PostMapping("/connect")
    public ResponseEntity<Map<String, Object>> connectWithPartner(@RequestBody PartnerConnection connection) {
        connection.setStatus("CONNECTED");
        connections.add(connection);

        Map<String, Object> resp = Map.of(
            "success", true,
            "message", "Connection proposal successfully sent to " + connection.getPartnerName(),
            "status", "CONNECTED",
            "partnerId", connection.getPartnerId()
        );
        return ResponseEntity.ok(resp);
    }

    private boolean isConnected(String partnerId) {
        return connections.stream().anyMatch(c -> c.getPartnerId().equalsIgnoreCase(partnerId));
    }
}
