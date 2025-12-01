    package com.hotel.management;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    import java.util.Arrays;
    import java.util.List;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                // ✅ DISABLE HTTP BASIC AUTHENTICATION (THIS WAS CAUSING 401!)
                .httpBasic(httpBasic -> httpBasic.disable())

                // ✅ DISABLE FORM LOGIN
                .formLogin(formLogin -> formLogin.disable())

                // ✅ DISABLE CSRF (Not needed for REST API)
                .csrf(csrf -> csrf.disable())

                // ✅ ENABLE CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ STATELESS SESSION (For JWT-based auth)
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

                    // PROTECTED ENDPOINTS - AUTHENTICATION REQUIRED
                    .anyRequest().authenticated()
                );

            return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();

            // ✅ ALLOW MULTIPLE ORIGINS (Both CRA and Vite ports)
            configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // Create React App
                "http://localhost:5173",  // Vite
                "http://localhost:3001"   // Alternative port
            ));

            // ✅ ALLOW ALL HTTP METHODS
            configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
            ));

            // ✅ ALLOW ALL HEADERS
            configuration.setAllowedHeaders(Arrays.asList("*"));

            // ✅ ALLOW CREDENTIALS (cookies, authorization headers)
            configuration.setAllowCredentials(true);

            // ✅ CACHE PREFLIGHT REQUESTS (1 hour)
            configuration.setMaxAge(3600L);

            // ✅ EXPOSE HEADERS (so frontend can read them)
            configuration.setExposedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Total-Count"
            ));

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }
    }

