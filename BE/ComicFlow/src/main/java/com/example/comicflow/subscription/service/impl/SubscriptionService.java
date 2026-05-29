package com.example.comicflow.subscription.service.impl;

import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.subscription.dto.response.CreateSubscription;
import com.example.comicflow.subscription.dto.response.SubscriptionPlanResponse;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.subscription.mapper.SubscriptionMapper;
import com.example.comicflow.subscription.mapper.SubscriptionPlanMapper;
import com.example.comicflow.subscription.repository.SubscriptionPlanRepository;
import com.example.comicflow.subscription.repository.SubscriptionRepository;
import com.example.comicflow.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Service
@RequiredArgsConstructor
public class SubscriptionService implements com.example.comicflow.subscription.service.ISubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPlanMapper subscriptionPlanMapper;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    public List<SubscriptionPlanResponse> getPlans() {
        return subscriptionPlanRepository.findAll()
                .stream()
                .map(subscriptionPlanMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void activateSubscription(User user, SubscriptionPlan plan) {
        subscriptionRepository.findByUserAndActiveTrue(user)
                .ifPresent(subscription -> {
                    subscription.setActive(false);
                    subscriptionRepository.save(subscription);
                });

        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = startTime.plusDays(plan.getDurationDays());

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .startDate(startTime)
                .endDate(endTime)
                .active(true)
                .usedChapters(0)
                .build();

        subscriptionRepository.save(subscription);
    }

    @Override
    public boolean canAccessMoreChapters(Subscription subscription) {
        if (!subscription.getActive()) {
            return false;
        }

        if (subscription.getEndDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (subscription.getPlan().getUnlimitedAccess()) {
            return true;
        }

        return subscription.getUsedChapters() < subscription.getPlan().getChapterLimit();
    }

    @Override
    public void consumeChapters(Subscription subscription) {
        subscription.setUsedChapters(subscription.getUsedChapters() + 1);
        subscriptionRepository.save(subscription);
    }

    @Override
    public SubscriptionPlan findById(UUID plainId) {
        return subscriptionPlanRepository.findById(plainId)
                .orElseThrow(() -> new NotFoundException("Subscription plan not found"));
    }

    @Override
    public Subscription getActiveSubscription(User user) {
        return subscriptionRepository.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new NotFoundException("Subscription not found"));
    }
}
