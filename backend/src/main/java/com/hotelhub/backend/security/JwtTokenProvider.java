package com.hotelhub.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate token từ Authentication (khi login thành công).
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        // ✅ Lấy roles từ authentication
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        Date now = new Date();
        
        // ✅ Kiểm tra nếu user có role ADMIN hoặc STAFF thì token không hết hạn
        boolean isAdminOrStaff = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_STAFF");
        Date expiry = isAdminOrStaff ? null : new Date(now.getTime() + jwtExpirationMs);

        JwtBuilder builder = Jwts.builder()
                .setSubject(username) // email/username
                .claim("roles", roles) // thêm roles vào token
                .setIssuedAt(now)
                .signWith(key, SignatureAlgorithm.HS256);
        
        // ✅ Chỉ set expiration nếu không phải admin/staff
        if (!isAdminOrStaff) {
            builder.setExpiration(expiry);
        }
        
        return builder.compact();
    }

    /**
     * Generate token khi bạn đã có username + authorities.
     */
    public String generateTokenFromUsername(String username, Collection<? extends GrantedAuthority> authorities) {
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Date now = new Date();
        
        // ✅ Kiểm tra nếu user có role ADMIN hoặc STAFF thì token không hết hạn
        boolean isAdminOrStaff = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_STAFF");
        Date expiry = isAdminOrStaff ? null : new Date(now.getTime() + jwtExpirationMs);

        JwtBuilder builder = Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) // thêm roles
                .setIssuedAt(now)
                .signWith(key, SignatureAlgorithm.HS256);
        
        // ✅ Chỉ set expiration nếu không phải admin/staff
        if (!isAdminOrStaff) {
            builder.setExpiration(expiry);
        }
        
        return builder.compact();
    }

    /**
     * Lấy username từ token.
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    /**
     * Lấy roles từ token.
     */
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody();
        return claims.get("roles", List.class);
    }

    /**
     * Validate token (hết hạn / signature không hợp lệ).
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            
            // ✅ Kiểm tra nếu token có expiration date
            if (claims.getExpiration() != null) {
                // Token có expiration, kiểm tra hết hạn
                return !claims.getExpiration().before(new Date());
            } else {
                // Token không có expiration (admin/staff), luôn valid
                return true;
            }
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}
