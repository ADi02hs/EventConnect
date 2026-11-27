package com.eventapp.service;

import com.eventapp.entity.Application;
import com.eventapp.entity.Event;
import com.eventapp.entity.Candidate;

import com.eventapp.repository.ApplicationRepository;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.CandidateRepository;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final EventRepository eventRepository;
    private final CandidateRepository candidateRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            EventRepository eventRepository,
            CandidateRepository candidateRepository) {

        this.applicationRepository = applicationRepository;
        this.eventRepository = eventRepository;
        this.candidateRepository = candidateRepository;
    }

    public Application createApplication(Long eventId, Long candidateId) {

        if (applicationRepository.existsByEventIdAndCandidateId(eventId, candidateId)) {
            throw new RuntimeException("Candidate has already applied for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Application application = new Application();

        application.setEvent(event);
        application.setCandidate(candidate);
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    
    public List<Application> getApplicationsByEventId(Long eventId) {
        return applicationRepository.findByEventId(eventId);
    }
    
    public Application updateApplicationStatus(Long id, String status) {
    	
    	if (!status.equals("PENDING") &&
    		    !status.equals("ACCEPTED") &&
    		    !status.equals("REJECTED")) {

    		    throw new RuntimeException("Invalid application status");
    		}

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}