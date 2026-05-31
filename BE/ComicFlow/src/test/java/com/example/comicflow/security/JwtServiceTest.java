package com.example.comicflow.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expiration = 3600000; // 1 hour
    private final long refreshExpiration = 86400000; // 24 hours

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", secret);
        ReflectionTestUtils.setField(jwtService, "expiration", expiration);
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", refreshExpiration);
    }

    @Test
    void generateToken_Success() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token);
        Claims claims = jwtService.extractClaims(token);
        assertEquals(email, claims.getSubject());
    }

    @Test
    void generateRefreshToken_Success() {
        String email = "test@example.com";
        String token = jwtService.generateRefreshToken(email);

        assertNotNull(token);
        Claims claims = jwtService.extractClaims(token);
        assertEquals(email, claims.getSubject());
    }

    @Test
    void extractClaims_Success() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        Claims claims = jwtService.extractClaims(token);

        assertNotNull(claims);
        assertEquals(email, claims.getSubject());
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }

    @Test
    void tokenExpiration_IsCorrect() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);
        Claims claims = jwtService.extractClaims(token);

        long diff = claims.getExpiration().getTime() - claims.getIssuedAt().getTime();
        assertEquals(expiration, diff);
    }
}
