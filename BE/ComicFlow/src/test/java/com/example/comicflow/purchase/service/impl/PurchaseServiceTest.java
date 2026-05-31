package com.example.comicflow.purchase.service.impl;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.purchase.entity.Purchase;
import com.example.comicflow.purchase.enums.AccessChapterType;
import com.example.comicflow.purchase.repository.PurchaseRepository;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.service.ISubscriptionService;
import com.example.comicflow.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseServiceTest {

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private ISubscriptionService subscriptionService;

    @InjectMocks
    private PurchaseService purchaseService;

    private User testUser;
    private Chapter testChapter;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(UUID.randomUUID()).username("testuser").build();
        testChapter = Chapter.builder().id(UUID.randomUUID()).price(100L).build();
    }

    @Test
    void fulfillPurchase_NewPurchase_Success() {
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(false);

        purchaseService.fulfillPurchase(testUser, testChapter);

        verify(purchaseRepository, times(1)).save(any(Purchase.class));
    }

    @Test
    void fulfillPurchase_AlreadyPurchased_NoAction() {
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(true);

        purchaseService.fulfillPurchase(testUser, testChapter);

        verify(purchaseRepository, never()).save(any(Purchase.class));
    }

    @Test
    void hasAccess_True() {
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(true);

        boolean hasAccess = purchaseService.hasAccess(testUser, testChapter);

        assertTrue(hasAccess);
    }

    @Test
    void unlockViaSubscription_Success() {
        Subscription subscription = new Subscription();
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(false);
        when(subscriptionService.getActiveSubscription(testUser)).thenReturn(subscription);
        when(subscriptionService.canAccessMoreChapters(subscription)).thenReturn(true);

        purchaseService.unlockViaSubscription(testUser, testChapter);

        verify(purchaseRepository, times(1)).save(any(Purchase.class));
        verify(subscriptionService, times(1)).consumeChapters(subscription);
    }

    @Test
    void unlockViaSubscription_NoActiveSubscription_ThrowsException() {
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(false);
        when(subscriptionService.getActiveSubscription(testUser)).thenReturn(null);

        assertThrows(BadRequestException.class, () -> purchaseService.unlockViaSubscription(testUser, testChapter));
    }

    @Test
    void unlockViaSubscription_CannotAccessMoreChapters_ThrowsException() {
        Subscription subscription = new Subscription();
        when(purchaseRepository.existsByUserAndChapter(testUser, testChapter)).thenReturn(false);
        when(subscriptionService.getActiveSubscription(testUser)).thenReturn(subscription);
        when(subscriptionService.canAccessMoreChapters(subscription)).thenReturn(false);

        assertThrows(BadRequestException.class, () -> purchaseService.unlockViaSubscription(testUser, testChapter));
    }

    @Test
    void getMyPurchases_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            Purchase purchase = Purchase.builder().id(UUID.randomUUID()).user(testUser).build();
            when(purchaseRepository.findByUserId(testUser.getId())).thenReturn(List.of(purchase));

            List<Purchase> result = purchaseService.getMyPurchases();

            assertEquals(1, result.size());
            assertEquals(purchase.getId(), result.get(0).getId());
        }
    }

    @Test
    void getPurchase_ReturnsPurchase() {
        Purchase purchase = Purchase.builder().id(UUID.randomUUID()).user(testUser).chapter(testChapter).build();
        when(purchaseRepository.findByUserAndChapter(testUser, testChapter)).thenReturn(Optional.of(purchase));

        Purchase result = purchaseService.getPurchase(testUser, testChapter);

        assertNotNull(result);
        assertEquals(purchase.getId(), result.getId());
    }

    @Test
    void getPurchasedChapterIds_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            Purchase purchase = Purchase.builder().id(UUID.randomUUID()).user(testUser).chapter(testChapter).build();
            when(purchaseRepository.findByUserId(testUser.getId())).thenReturn(List.of(purchase));

            List<UUID> result = purchaseService.getPurchasedChapterIds();

            assertEquals(1, result.size());
            assertEquals(testChapter.getId(), result.get(0));
        }
    }
}
