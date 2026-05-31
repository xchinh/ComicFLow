package com.example.comicflow.auth.service.impl;

import com.example.comicflow.auth.dto.request.LoginRequest;
import com.example.comicflow.auth.dto.request.RefreshTokenRequest;
import com.example.comicflow.auth.dto.request.RegisterRequest;
import com.example.comicflow.auth.dto.response.AuthResponse;
import com.example.comicflow.auth.dto.response.RefreshResponse;
import com.example.comicflow.auth.service.IAuthService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.security.JwtService;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.enums.Role;
import com.example.comicflow.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request){
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(request.getPassword())
                )
                .username(request.getUsername())
                .role(Optional.ofNullable(request.getRole()).orElse(Role.READER))
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        return new AuthResponse(accessToken, refreshToken, user.getRole());
    }

    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new NotFoundException("Not found user with email: " + request.getEmail())
                );

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matches) {
            throw new BadRequestException("Invalid password");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        return new AuthResponse(accessToken, refreshToken, user.getRole());
    }

    @Override
    public RefreshResponse refresh(RefreshTokenRequest request) {
        Claims claims = jwtService.extractClaims(request.getRefreshToken());
        String email = claims.getSubject();
        System.out.println("Email" + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Not Found User"));

        String accessToken = jwtService.generateToken(user.getEmail());
        return new RefreshResponse(accessToken);
    }
}
