// ClassCreateRequest.java
package com.example.tution.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class ClassCreateRequest {
    @NotBlank private String title;
    private String description;
    @NotNull private java.time.LocalDateTime startAt;
    @Min(15) @Max(240) private Integer durationMinutes = 60;
}

// ClassResponse.java
package com.example.tution.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Builder
public class ClassResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startAt;
    private Integer durationMinutes;
    private String meetLink;
}
