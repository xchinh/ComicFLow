package com.example.comicflow.user.service;

import com.example.comicflow.user.dto.response.UserResponse;
import com.example.comicflow.user.entity.User;

import java.util.UUID;

public interface IUserService {
    UserResponse getUserInfo(UUID userId);
    User findById(UUID userId);
    User findByUsername(String username);
}
