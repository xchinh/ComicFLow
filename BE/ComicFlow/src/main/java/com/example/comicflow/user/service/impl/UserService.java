package com.example.comicflow.user.service.impl;

import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.user.dto.response.UserResponse;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.mapper.UserMapper;
import com.example.comicflow.user.repository.UserRepository;
import com.example.comicflow.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse getUserInfo(UUID userId) {
        User user = findById(userId);
        return userMapper.toResponse(user);
    }

    @Override
    public User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found with username: " + username));
    }
}
