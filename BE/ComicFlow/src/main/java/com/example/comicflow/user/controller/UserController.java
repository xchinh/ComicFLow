package com.example.comicflow.user.controller;

import com.example.comicflow.common.response.ApiResponse;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.user.dto.response.UserResponse;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final IPurchaseService purchaseService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyInfo() {
        User currentUser = Utils.getCurrentUser();
        UserResponse userResponse = userService.getUserInfo(currentUser.getId());
        return ApiResponse.success("User info fetched successfully", userResponse);
    }

    @GetMapping("/me/chapters")
    public ApiResponse<List<UUID>> getMyChapters() {
        List<UUID> chapterIds = purchaseService.getPurchasedChapterIds();
        return ApiResponse.success("Purchased chapters fetched successfully", chapterIds);
    }
}
