package com.hotelhub.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // ✅ Danh sách các đường dẫn public không cần JWT
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
            "/api/auth/",           // Tất cả auth endpoints
            "/api/email/",          // Tất cả email endpoints
            "/api/bookings/guest",  // Guest booking
            "/api/bookings/guest/", // Guest booking with ID
            "/api/bookings/rooms",  // Public room listing
            "/api/test/public",     // Public test
            "/api/public/"          // Các API public khác
    );

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ Bỏ qua filter cho các đường dẫn public
        if (isPublicPath(path)) {
            System.out.println(">>> [INFO] JWT filter: Skipping public path: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        String token = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        try {
            if (token != null && !token.isEmpty()) {
                System.out.println(">>> [DEBUG] JWT filter: Token received for path: " + path);
                System.out.println(">>> [DEBUG] JWT filter: Token length: " + token.length());
                System.out.println(">>> [DEBUG] JWT filter: Token start: " +
                        token.substring(0, Math.min(50, token.length())) + "...");

                boolean isValid = tokenProvider.validateToken(token);
                System.out.println(">>> [DEBUG] JWT filter: Token validation result: " + isValid);

                if (isValid) {
                    String username = tokenProvider.getUsernameFromToken(token);
                    System.out.println(">>> [DEBUG] JWT filter: Username extracted: " + username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println(">>> [DEBUG] JWT filter: UserDetails loaded: " +
                            (userDetails != null ? "success" : "failed"));

                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.out.println(">>> [SUCCESS] JWT filter: User authenticated - " + username);
                    } else {
                        System.out.println(">>> [ERROR] JWT filter: UserDetails is null for username: " + username);
                    }
                } else {
                    System.out.println(">>> [WARN] JWT filter: Token validation failed for path: " + path);
                }
            } else {
                System.out.println(">>> [WARN] JWT filter: No token provided for protected path: " + path);
            }
        } catch (Exception ex) {
            System.out.println(">>> [ERROR] JWT filter: " + ex.getClass().getSimpleName() +
                    " - " + ex.getMessage() + " for path: " + path);
            ex.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Kiểm tra xem path có phải là public không
     */
    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }
}