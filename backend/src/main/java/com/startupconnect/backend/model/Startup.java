package com.startupconnect.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "startups")
public class Startup {

    @Id
    private String id;
    private String name;
    private String industry;
    private String description;
    private String weakness;
    private double revenue;
    private String funding;
    private int matchScore;
    private String location;

    public Startup() {}

    public Startup(String id, String name, String industry, String description, String weakness, double revenue, String funding, int matchScore, String location) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.description = description;
        this.weakness = weakness;
        this.revenue = revenue;
        this.funding = funding;
        this.matchScore = matchScore;
        this.location = location;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWeakness() {
        return weakness;
    }

    public void setWeakness(String weakness) {
        this.weakness = weakness;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public String getFunding() {
        return funding;
    }

    public void setFunding(String funding) {
        this.funding = funding;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
