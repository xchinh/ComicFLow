package com.example.comicflow.subscription.service.impl;

import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.subscription.dto.response.SubscriptionPlanResponse;
import com.example.comicflow.subscription.dto.response.UserSubscriptionResponse;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.subscription.mapper.SubscriptionMapper;
import com.example.comicflow.subscription.mapper.SubscriptionPlanMapper;
import com.example.comicflow.subscription.repository.SubscriptionPlanRepository;
import com.example.comicflow.subscription.repository.SubscriptionRepository;
import com.example.comicflow.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Mock
    private SubscriptionPlanMapper subscriptionPlanMapper;

    @Mock
    private SubscriptionMapper subscriptionMapper;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User testUser;
    private SubscriptionPlan testPlan;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(UUID.randomUUID()).username("testuser").build();
        testPlan = SubscriptionPlan.builder()
                .id(UUID.randomUUID())
                .durationDays(30)
                .chapterLimit(10)
                .unlimitedAccess(false)
                .build();
    }

    @Test
    void getPlans_ReturnsList() {
        when(subscriptionPlanRepository.findAll()).thenReturn(List.of(testPlan));
        when(subscriptionPlanMapper.toResponse(any(SubscriptionPlan.class))).thenReturn(new SubscriptionPlanResponse());

        List<SubscriptionPlanResponse> result = subscriptionService.getPlans();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void activateSubscription_Success() {
        Subscription oldSubscription = Subscription.builder().active(true).build();
        when(subscriptionRepository.findByUserIdAndActiveTrue(testUser.getId())).thenReturn(Optional.of(oldSubscription));

        subscriptionService.activateSubscription(testUser, testPlan);

        assertFalse(oldSubscription.getActive());
        verify(subscriptionRepository, times(1)).save(oldSubscription);
        verify(subscriptionRepository, times(1)).save(argThat(s -> s.getActive() && s.getUser().equals(testUser)));
    }

    @Test
    void canAccessMoreChapters_Success() {
        Subscription subscription = Subscription.builder()
                .active(true)
                .endDate(LocalDateTime.now().plusDays(1))
                .usedChapters(5)
                .plan(testPlan)
                .build();

        assertTrue(subscriptionService.canAccessMoreChapters(subscription));
    }

    @Test
    void canAccessMoreChapters_Expired_ReturnsFalse() {
        Subscription subscription = Subscription.builder()
                .active(true)
                .endDate(LocalDateTime.now().minusDays(1))
                .usedChapters(5)
                .plan(testPlan)
                .build();

        assertFalse(subscriptionService.canAccessMoreChapters(subscription));
    }

    @Test
    void canAccessMoreChapters_LimitReached_ReturnsFalse() {
        Subscription subscription = Subscription.builder()
                .active(true)
                .endDate(LocalDateTime.now().plusDays(1))
                .usedChapters(10)
                .plan(testPlan)
                .build();

        assertFalse(subscriptionService.canAccessMoreChapters(subscription));
    }

    @Test
    void consumeChapters_Success() {
        Subscription subscription = Subscription.builder().usedChapters(0).build();

        subscriptionService.consumeChapters(subscription);

        assertEquals(1, subscription.getUsedChapters());
        verify(subscriptionRepository, times(1)).save(subscription);
    }

    @Test
    void findById_Found_ReturnsPlan() {
        when(subscriptionPlanRepository.findById(testPlan.getId())).thenReturn(Optional.of(testPlan));

        SubscriptionPlan result = subscriptionService.findById(testPlan.getId());

        assertEquals(testPlan.getId(), result.getId());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(subscriptionPlanRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> subscriptionService.findById(UUID.randomUUID()));
    }

    @Test
    void getMySubscription_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            Subscription subscription = Subscription.builder().build();
            when(subscriptionRepository.findByUserIdAndActiveTrue(testUser.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionMapper.toUserSubscriptionResponse(subscription)).thenReturn(new UserSubscriptionResponse());

            UserSubscriptionResponse result = subscriptionService.getMySubscription();

            assertNotNull(result);
        }
    }
}
