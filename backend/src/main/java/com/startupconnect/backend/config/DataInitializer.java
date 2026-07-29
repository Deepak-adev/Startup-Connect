package com.startupconnect.backend.config;

import com.startupconnect.backend.model.Startup;
import com.startupconnect.backend.repository.StartupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(StartupRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Startup> mockStartups = List.of(
                    new Startup(
                        null,
                        "EcoFlux Energy",
                        "CleanTech",
                        "AI-driven smart grid optimization system reducing commercial energy waste by 35%.",
                        "High hardware deployment costs for legacy grids",
                        250000.00,
                        "$1.8M Seed",
                        94,
                        "San Francisco, CA"
                    ),
                    new Startup(
                        null,
                        "HealthPulse AI",
                        "Healthcare",
                        "Predictive patient monitoring platform for ICU units powered by real-time biometrics.",
                        "Regulatory approvals and slow hospital sales cycle",
                        420000.00,
                        "$3.2M Series A",
                        91,
                        "Boston, MA"
                    ),
                    new Startup(
                        null,
                        "QuantumLogistics",
                        "Logistics",
                        "Next-gen route optimization leveraging quantum-inspired algorithms for last-mile delivery.",
                        "Lack of enterprise partner integration channels",
                        180000.00,
                        "$900K Pre-Seed",
                        88,
                        "Austin, TX"
                    ),
                    new Startup(
                        null,
                        "FinStack Solutions",
                        "Fintech",
                        "Embedded compliance and automated cross-border payroll infrastructure for remote startups.",
                        "Navigating international banking compliance regulations",
                        650000.00,
                        "$4.5M Series A",
                        96,
                        "New York, NY"
                    ),
                    new Startup(
                        null,
                        "AgriGrow Tech",
                        "Agriculture",
                        "Autonomous drone fleet for precision pesticide delivery and crop health imaging.",
                        "Seasonal revenue fluctuations",
                        120000.00,
                        "$600K Seed",
                        85,
                        "Des Moines, IA"
                    ),
                    new Startup(
                        null,
                        "CyberShield Pro",
                        "Cybersecurity",
                        "Zero-trust microsegmentation software for cloud-native microservice architectures.",
                        "High competition from legacy security vendors",
                        890000.00,
                        "$5.0M Series A",
                        97,
                        "Seattle, WA"
                    )
                );

                repository.saveAll(mockStartups);
                System.out.println(">>> Mock Startup Data successfully populated into MongoDB! Count: " + repository.count());
            } else {
                System.out.println(">>> MongoDB already contains " + repository.count() + " startup records.");
            }
        };
    }
}
