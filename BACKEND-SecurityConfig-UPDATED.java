package com.hotel.management;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // ✅ PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED
                .requestMatchers("/api/users/**").permitAll()  // Signup, login
                .requestMatchers("/api/auth/**").permitAll()   // Auth endpoints
                .requestMatchers("/facilities/**").permitAll() // ✅ FIXED: Allow all facility endpoints
                .requestMatchers("/facility-bookings/**").permitAll() // ✅ Temporarily public for testing
                .requestMatchers("/api/activity-logs/**").permitAll()
                .requestMatchers("/api/activity-demo/**").permitAll()

                // 🔒 PROTECTED ENDPOINTS - AUTHENTICATION REQUIRED
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ ALLOW BOTH VITE AND CRA PORTS
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",  // React (Create React App)
            "http://localhost:5173"   // Vite (Your setup)
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

