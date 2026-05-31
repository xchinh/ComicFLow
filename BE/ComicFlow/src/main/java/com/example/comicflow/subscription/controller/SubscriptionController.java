package com.example.comicflow.subscription.controller;

import com.example.comicflow.common.response.ApiResponse;
import com.example.comicflow.subscription.dto.response.CreateSubscription;
import com.example.comicflow.subscription.dto.response.SubscriptionPlanResponse;
import com.example.comicflow.subscription.dto.response.UserSubscriptionResponse;
import com.example.comicflow.subscription.service.ISubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final ISubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ApiResponse<List<SubscriptionPlanResponse>> getPlans() {
        List<SubscriptionPlanResponse> subscriptionPlans = subscriptionService.getPlans();
        return ApiResponse.success("Plans fetched successfully", subscriptionPlans);
    }

    @GetMapping("/me")
    public ApiResponse<UserSubscriptionResponse> getMySubscription() {
        UserSubscriptionResponse userSubscription = subscriptionService.getMySubscription();
        return ApiResponse.success("User subscription fetched successfully", userSubscription);
    }

}
