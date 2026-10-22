package com.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.security.JwtAuthFilter;

/**
 * Segurança da API (stateless + JWT).
 *
 * Princípio do menor privilégio: catálogo (leitura) e checkout de convidado
 * são públicos; todo o resto exige autenticação e as escritas/leituras
 * administrativas exigem papel ADMIN. A autorização é aplicada no servidor —
 * o frontend nunca deve ser a única barreira.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(
            Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList()
        );
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authorizeHttpRequests(auth -> auth
                // Auth pública (login/cadastro); /me exige token válido
                .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register", "/auth/setup").permitAll()
                .requestMatchers("/auth/me").authenticated()
                // Catálogo: leitura pública
                .requestMatchers(HttpMethod.GET, "/products", "/products/*", "/categories", "/images/**").permitAll()
                // Checkout de convidado (sem conta): criar pedido é público
                .requestMatchers(HttpMethod.POST, "/orders").permitAll()
                // Pedidos do próprio usuário logado
                .requestMatchers(HttpMethod.GET, "/orders/mine").authenticated()
                // Consulta pública por nome (fluxo de convidado legado)
                .requestMatchers(HttpMethod.GET, "/orders/customer/**").permitAll()
                // Admin: leitura de todos os pedidos e transições de status
                .requestMatchers(HttpMethod.GET, "/orders", "/orders/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/orders/**").hasRole("ADMIN")
                // Admin: escrita de catálogo e upload de imagens
                .requestMatchers(HttpMethod.POST, "/products", "/categories", "/images/upload").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/products/**", "/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/products/**", "/categories/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
