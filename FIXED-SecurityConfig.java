package com.hotel.management;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ✅ DISABLE HTTP BASIC AUTHENTICATION
            .httpBasic(basic -> basic.disable())

            // ✅ DISABLE FORM LOGIN
            .formLogin(form -> form.disable())

            // ✅ DISABLE CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ CONFIGURE CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ✅ SESSION MANAGEMENT - STATELESS
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ✅ AUTHORIZATION RULES
            .authorizeHttpRequests(auth -> auth
                // PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/facilities/**").permitAll()
                .requestMatchers("/facility-bookings/**").permitAll()
                .requestMatchers("/api/activity-logs/**").permitAll()
                .requestMatchers("/api/activity-demo/**").permitAll()

                // EVERYTHING ELSE REQUIRES AUTHENTICATION
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ALLOW ORIGINS
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",  // React (Create React App)
            "http://localhost:5173"   // Vite
        ));

        // ALLOW METHODS
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // ALLOW HEADERS
        config.setAllowedHeaders(List.of("*"));

        // ALLOW CREDENTIALS
        config.setAllowCredentials(true);

        // CACHE PREFLIGHT
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

