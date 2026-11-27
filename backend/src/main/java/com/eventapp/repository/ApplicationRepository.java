package com.eventapp.repository;

import com.eventapp.entity.Application;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByEventIdAndCandidateId(Long eventId, Long candidateId);
    
    List<Application> findByEventId(Long eventId);

}