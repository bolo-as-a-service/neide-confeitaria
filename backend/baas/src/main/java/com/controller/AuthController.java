package com.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.dto.LoginDTO;
import com.dto.RegisterDTO;
import com.model.User;
import com.security.JwtService;
import com.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    private static Map<String, Object> userPayload(User user) {
        return Map.of(
            "id", user.getId(),
            "name", user.getName() != null ? user.getName() : "",
            "email", user.getEmail(),
            "phone", user.getPhone() != null ? user.getPhone() : "",
            "role", user.getRole()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            User user = authService.login(dto);
            String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("token", token, "user", userPayload(user)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        try {
            User user = authService.register(dto);
            String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("token", token, "user", userPayload(user)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Sessão atual: lê o usuário do banco a partir do subject do JWT.
     * O frontend usa esta rota para validar o token e obter o papel real
     * (nunca confia no papel guardado no navegador).
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {
            User user = authService.findById(Long.valueOf(authentication.getName()));
            return ResponseEntity.ok(Map.of("user", userPayload(user)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bootstrap do primeiro admin. Permitido UMA vez: se já existir qualquer
     * ADMIN, responde 403. Remova esta rota após o setup inicial.
     */
    @PostMapping("/setup")
    public ResponseEntity<?> setup(@RequestBody Map<String, String> body) {
        try {
            if (authService.adminExists()) {
                return ResponseEntity.status(403).body(Map.of("error", "Setup já realizado"));
            }
            User user = authService.createAdmin(body.get("name"), body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of("message", "Admin criado", "email", user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
