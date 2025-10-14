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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ Bỏ qua filter cho auth, guest booking và room APIs
        if (path.startsWith("/api/auth/")
                || path.startsWith("/api/bookings/guest")
                || path.startsWith("/api/bookings/rooms")
                || path.startsWith("/api/test/public")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        String token = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        try {
            if (token != null) {
                System.out.println(">>> [DEBUG] JWT filter: Token received, length: " + token.length());
                System.out.println(">>> [DEBUG] JWT filter: Token start: " + token.substring(0, Math.min(50, token.length())) + "...");
                
                boolean isValid = tokenProvider.validateToken(token);
                System.out.println(">>> [DEBUG] JWT filter: Token validation result: " + isValid);
                
                if (isValid) {
                    String username = tokenProvider.getUsernameFromToken(token);
                    System.out.println(">>> [DEBUG] JWT filter: Username extracted: " + username);
                    
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println(">>> [DEBUG] JWT filter: UserDetails loaded: " + (userDetails != null ? "success" : "failed"));
                    
                    if (userDetails != null) {
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
                                userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.out.println(">>> [SUCCESS] JWT filter: User authenticated - " + username);
                    } else {
                        System.out.println(">>> [ERROR] JWT filter: UserDetails is null for username: " + username);
                    }
                } else {
                    System.out.println(">>> [WARN] JWT filter: Token validation failed for path: " + path);
                }
            } else {
                System.out.println(">>> [WARN] JWT filter: No token provided for path: " + path);
            }
        } catch (Exception ex) {
            System.out.println(">>> [ERROR] JWT filter: " + ex.getClass().getSimpleName() + " - " + ex.getMessage() + " for path: " + path);
            ex.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}
