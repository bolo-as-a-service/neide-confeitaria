package com.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Emissão e validação de JWT (HS256).
 *
 * O segredo vem de {@code app.jwt.secret} / env {@code JWT_SECRET} e precisa
 * ter ao menos 32 bytes. Sem segredo configurado, usa um segredo fixo de
 * DESENVOLVIMENTO e registra alerta — nunca usar em produção.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret:}") String secret,
            @Value("${app.jwt.expiration-hours:12}") long expirationHours) {
        String effective = (secret == null || secret.isBlank()) ? System.getenv("JWT_SECRET") : secret;
        if (effective == null || effective.getBytes(StandardCharsets.UTF_8).length < 32) {
            log.warn("JWT_SECRET ausente ou com menos de 32 bytes: usando segredo de DESENVOLVIMENTO. Configure JWT_SECRET em produção!");
            effective = "dev-only-secret-nao-usar-em-producao-0123456789";
        }
        this.key = Keys.hmacShaKeyFor(effective.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationHours * 3600_000L;
    }

    /** Emite token com subject=userId e claims email/role. */
    public String generateToken(Long userId, String email, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    /** Valida assinatura e expiração; lança exceção se inválido. */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
