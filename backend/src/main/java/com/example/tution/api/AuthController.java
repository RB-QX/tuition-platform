package com.example.tution.api;

import com.example.tution.dto.AuthRequest;
import com.example.tution.dto.AuthResponse;
import com.example.tution.model.Role;
import com.example.tution.model.User;
import com.example.tution.repo.UserRepository;
import com.example.tution.security.JwtService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")          // ✅ controller base path
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;
    private final UserRepository repo;

    // ------------------------------------------------------------
    // Seed one admin + one student the very first time the app runs
    // ------------------------------------------------------------
    @PostConstruct
    void init() {
        if (repo.count() == 0) {
            repo.save(User.builder()
                    .name("Admin One")
                    .email("admin@demo.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());

            repo.save(User.builder()
                    .name("Student One")
                    .email("student@demo.com")
                    .password(encoder.encode("stud123"))
                    .role(Role.STUDENT)
                    .build());
        }
    }

    // ------------------------
    // POST /api/auth/login
    // ------------------------
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest req) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(
                    req.getEmail(), req.getPassword());
            authManager.authenticate(authToken);          // throws if bad creds

            String jwt = jwtService.generateToken(req.getEmail(), java.util.Map.of());
            return new AuthResponse(jwt);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }
}
