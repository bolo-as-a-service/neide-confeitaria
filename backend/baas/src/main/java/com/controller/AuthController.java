package com.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dto.LoginDTO;
import com.dto.RegisterDTO;
import com.model.User;
import com.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            User user = authService.login(dto);
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        try {
            User user = authService.register(dto);
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // use uma vez pra criar o admin, depois pode remover
    @PostMapping("/setup")
    public ResponseEntity<?> setup(@RequestBody Map<String, String> body) {
        try {
            User user = authService.createAdmin(body.get("name"), body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of("message", "Admin criado", "email", user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}