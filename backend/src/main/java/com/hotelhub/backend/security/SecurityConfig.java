package com.hotelhub.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // ✅ Thêm CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Cho phép tất cả origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // ✅ Enable CORS với configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/verify-email",        // ✅ THÊM DÒNG NÀY
                                "/api/auth/resend-verification",  // ✅ THÊM DÒNG NÀY
                                "/api/auth/password/forgot",
                                "/api/auth/password/verify-otp",
                                "/api/auth/password/reset",
                                "/api/auth/password/resend-otp"
                        ).permitAll()
                        // ✅ Cho phép tất cả request đến /api/auth/** (không cần đăng nhập)
                        .requestMatchers("/api/auth/**").permitAll()

                        // ✅ Cho phép các endpoint email
                        .requestMatchers("/api/email/**").permitAll()

                        // ✅ Cho phép đăng ký / đăng nhập
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh", "/api/auth/logout").permitAll()
                        // ✅ Admin tạo user - chỉ admin mới được
                        .requestMatchers(HttpMethod.POST, "/api/auth/admin/create-user").hasAuthority("ROLE_ADMIN")
                        // ✅ Email API - cho phép gửi email
                        .requestMatchers("/api/email/**").permitAll()

                        // ✅ Cho phép guest booking (không cần login)
                        .requestMatchers(HttpMethod.POST, "/api/bookings/guest").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/bookings/guest/**").permitAll()

                        // ✅ Cho phép xem phòng (không cần login)
                        .requestMatchers(HttpMethod.GET, "/api/bookings/rooms/**").permitAll()

                        // ✅ Room CRUD APIs
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasAuthority("ROLE_ADMIN")


                        // ✅ RoomType CRUD APIs
                        .requestMatchers(HttpMethod.GET, "/api/room-types/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/room-types").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/room-types/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/room-types/**").hasAuthority("ROLE_ADMIN")

                        // ✅ Amenity CRUD APIs
                        .requestMatchers(HttpMethod.GET, "/api/amenities/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/amenities").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/amenities/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/amenities/**").hasAuthority("ROLE_ADMIN")

                        // ✅ Room Image CRUD APIs
                        .requestMatchers(HttpMethod.GET, "/api/rooms/*/images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms/*/images").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/*/images/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/*/images/**").hasAuthority("ROLE_ADMIN")


                        // ✅ User booking APIs - yêu cầu login với role
                        .requestMatchers(HttpMethod.GET, "/api/bookings").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/bookings").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/bookings/user/**").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/user/**").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN")

            // ✅ Public test API
            .requestMatchers("/api/test/public").permitAll()
            .requestMatchers("/api/test/debug-price/**").permitAll()

                        // ✅ Admin test API (không cần auth)
                        .requestMatchers("/api/admin/test-scheduled").permitAll()

                        // ✅ Admin Booking Management APIs
                        .requestMatchers("/api/admin/bookings/**").hasAuthority("ROLE_ADMIN")

                        // ✅ Admin Role Management APIs
                        .requestMatchers("/api/admin/roles/**").hasAuthority("ROLE_ADMIN")

                        // ✅ User Management APIs (Admin only)
                        .requestMatchers(HttpMethod.GET, "/api/users/public").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*/public").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*/toggle-status").hasAuthority("ROLE_ADMIN")

                        // ✅ Staff Booking Management APIs
                        .requestMatchers("/api/staff/bookings/**").hasAnyAuthority("ROLE_STAFF", "ROLE_ADMIN")

                        // ✅ Activity Log APIs (Admin only)
                        .requestMatchers("/api/admin/activity-logs/**").hasAuthority("ROLE_ADMIN")


                        // ✅ Reports APIs - Admin và Staff
                        .requestMatchers("/api/admin/reports/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")

                        // ✅ Public test API for reports
                        .requestMatchers("/api/admin/reports/public-test").permitAll()
                        .requestMatchers("/api/admin/reports/overview").permitAll()

                        // ✅ Notification APIs (All authenticated users)
                        .requestMatchers("/api/notifications/**").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN")

                        // ✅ Admin API - chỉ cho phép ROLE_ADMIN
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                        // ✅ Các endpoint public khác
                        .requestMatchers("/api/public/**").permitAll()

                        // ✅ Mặc định: các request khác phải login
                        .anyRequest().authenticated());

        // ✅ Thêm JWT Filter vào pipeline
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}