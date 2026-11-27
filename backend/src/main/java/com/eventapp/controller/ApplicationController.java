package com.eventapp.controller;
import org.*;
import com.eventapp.entity.Application;
import com.eventapp.service.ApplicationService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application createApplication(
            @RequestParam Long eventId,
            @RequestParam Long candidateId) {

        return applicationService.createApplication(eventId, candidateId);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }
    
    @GetMapping("/event/{eventId}")
    public List<Application> getApplicationsByEventId(
            @PathVariable Long eventId) {

        return applicationService.getApplicationsByEventId(eventId);
    }
    
    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService.updateApplicationStatus(id, status);
    }
}