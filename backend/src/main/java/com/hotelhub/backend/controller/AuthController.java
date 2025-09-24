package com.hotelhub.backend.controller;

import com.hotelhub.backend.dto.request.*;
import com.hotelhub.backend.dto.response.JwtResponse;
import com.hotelhub.backend.entity.RefreshToken;
import com.hotelhub.backend.entity.User;
import com.hotelhub.backend.security.JwtTokenProvider;
import com.hotelhub.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User u = authService.register(req);
        return ResponseEntity.ok("Registered: " + u.getEmail());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // authenticate
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        // generate access token
        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null);
        String accessToken = jwtTokenProvider.generateTokenFromUsername(req.getEmail());

        // get user id to create refresh token
        User user = authService.findByEmail(req.getEmail());
        RefreshToken rt = refreshTokenService.createRefreshToken(user.getUserId());

        JwtResponse resp = JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rt.getToken())
                .expiresIn(Long.parseLong(System.getProperty("app.jwt.expiration-ms", "3600000")))
                .build();

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestParam("refreshToken") String refreshToken) {
        return refreshTokenService.findByToken(refreshToken)
                .map(rt -> {
                    if (rt.getExpiresAt().isBefore(java.time.LocalDateTime.now())
                            || Boolean.TRUE.equals(rt.getRevoked())) {
                        return ResponseEntity.badRequest().body("Refresh token expired or revoked");
                    }
                    String newAccess = jwtTokenProvider.generateTokenFromUsername(rt.getUser().getEmail());
                    JwtResponse resp = JwtResponse.builder()
                            .accessToken(newAccess)
                            .refreshToken(rt.getToken())
                            .expiresIn(Long.parseLong(System.getProperty("app.jwt.expiration-ms", "3600000")))
                            .build();
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("Invalid refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam("refreshToken") String refreshToken) {
        return refreshTokenService.findByToken(refreshToken)
                .map(rt -> {
                    rt.setRevoked(true);
                    // save
                    refreshTokenService.findByToken(refreshToken).ifPresent(r -> {
                    }); // just to illustrate
                    return ResponseEntity.ok("Logged out");
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("Invalid refresh token"));
    }
}
