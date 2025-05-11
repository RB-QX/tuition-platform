package com.example.tution.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassSession {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private LocalDateTime startAt;     // ISO date-time
    private Integer durationMinutes;   // e.g. 60

    private String meetLink;           // Google Meet URL

    @ManyToOne(optional = false)
    private User createdBy;
}
