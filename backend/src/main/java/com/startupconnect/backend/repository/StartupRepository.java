package com.startupconnect.backend.repository;

import com.startupconnect.backend.model.Startup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StartupRepository extends MongoRepository<Startup, String> {
    List<Startup> findByIndustryIgnoreCase(String industry);
}
