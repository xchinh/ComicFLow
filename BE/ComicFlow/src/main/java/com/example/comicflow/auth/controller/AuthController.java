package com.example.comicflow.auth.controller;

import com.example.comicflow.auth.dto.request.LoginRequest;
import com.example.comicflow.auth.dto.request.RegisterRequest;
import com.example.comicflow.auth.dto.response.AuthResponse;
import com.example.comicflow.auth.service.IAuthService;
import com.example.comicflow.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ApiResponse.success("Registered Successfully", authResponse);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ApiResponse.success("Login Successfully", authResponse);
    }
}
