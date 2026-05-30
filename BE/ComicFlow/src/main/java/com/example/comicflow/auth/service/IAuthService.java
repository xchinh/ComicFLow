package com.example.comicflow.auth.service;

import com.example.comicflow.auth.dto.request.LoginRequest;
import com.example.comicflow.auth.dto.request.RefreshTokenRequest;
import com.example.comicflow.auth.dto.request.RegisterRequest;
import com.example.comicflow.auth.dto.response.AuthResponse;
import com.example.comicflow.auth.dto.response.RefreshResponse;

public interface IAuthService {
    public AuthResponse register(RegisterRequest request);
    public AuthResponse login(LoginRequest request);
    public RefreshResponse refresh(RefreshTokenRequest request);
}
