package com.example.comicflow.common.utils;

import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("You are not allowed to get current user");
        }

        return (User) authentication.getPrincipal();
    }
}
