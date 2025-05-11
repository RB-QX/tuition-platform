package com.example.tution.api;

import com.example.tution.dto.*;
import com.example.tution.model.ClassSession;
import com.example.tution.model.Role;
import com.example.tution.repo.ClassSessionRepository;
import com.example.tution.repo.UserRepository;
import com.example.tution.service.CalendarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassSessionController {

    private final ClassSessionRepository repo;
    private final UserRepository userRepo;
    private final CalendarService calendar;

    // -------- for students & admin --------
    @GetMapping
    public List<ClassResponse> upcoming() {
        return repo.findByStartAtAfterOrderByStartAtAsc(LocalDateTime.now())
                .stream()
                .map(c -> ClassResponse.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .startAt(c.getStartAt())
                        .durationMinutes(c.getDurationMinutes())
                        .meetLink(c.getMeetLink())
                        .build())
                .toList();
    }

    // -------- admin only --------
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClassResponse create(@Valid @RequestBody ClassCreateRequest req,
                                @AuthenticationPrincipal UserDetails principal) throws Exception {

        var creator = userRepo.findByEmail(principal.getUsername()).orElseThrow();

        String meet = calendar.createEvent(
                req.getTitle(), req.getDescription(),
                req.getStartAt(), req.getDurationMinutes());

        ClassSession saved = repo.save(ClassSession.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .startAt(req.getStartAt())
                .durationMinutes(req.getDurationMinutes())
                .meetLink(meet)
                .createdBy(creator)
                .build());

        return ClassResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .startAt(saved.getStartAt())
                .durationMinutes(saved.getDurationMinutes())
                .meetLink(saved.getMeetLink())
                .build();
    }
}
