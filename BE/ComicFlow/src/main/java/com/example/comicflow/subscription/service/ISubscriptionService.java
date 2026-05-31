package com.example.comicflow.subscription.service;

import com.example.comicflow.subscription.dto.response.CreateSubscription;
import com.example.comicflow.subscription.dto.response.SubscriptionPlanResponse;
import com.example.comicflow.subscription.dto.response.UserSubscriptionResponse;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface ISubscriptionService {
    List<SubscriptionPlanResponse> getPlans();

    boolean canAccessMoreChapters(Subscription subscription);

    void consumeChapters(Subscription subscription);

    SubscriptionPlan findById(UUID plainId);

    void activateSubscription(User user, SubscriptionPlan plan);

    Subscription getActiveSubscription(User user);

    java.util.Optional<Subscription> getActiveSubscriptionOptional(User user);

    UserSubscriptionResponse getMySubscription();
}
