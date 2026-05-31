package com.example.comicflow.purchase.service.impl;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.purchase.entity.Purchase;
import com.example.comicflow.purchase.enums.AccessChapterType;
import com.example.comicflow.purchase.repository.PurchaseRepository;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.service.ISubscriptionService;
import com.example.comicflow.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Service
@RequiredArgsConstructor
public class PurchaseService implements com.example.comicflow.purchase.service.IPurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final ISubscriptionService subscriptionService;

    @Override
    public void fulfillPurchase(User user, Chapter chapter) {
        boolean existsByUserAndChapter = purchaseRepository.existsByUserAndChapter(user, chapter);

        if  (existsByUserAndChapter) {
            return;
        }

        Purchase purchase = Purchase.builder()
                .user(user)
                .chapter(chapter)
                .accessChapterType(AccessChapterType.DIRECT_PURCHASE)
                .amount(chapter.getPrice().longValue())
                .build();

        purchaseRepository.save(purchase);
    }

    @Override
    public boolean hasAccess(User user, Chapter chapter) {
        return purchaseRepository.existsByUserAndChapter(user, chapter);
    }

    @Override
    @Transactional
    public void unlockViaSubscription(User user, Chapter chapter) {
        boolean existsByUserAndChapter = purchaseRepository.existsByUserAndChapter(user, chapter);
        if (existsByUserAndChapter) {
            return;
        }

        Subscription subscription = subscriptionService.getActiveSubscription(user);

        if (subscription == null) {
            throw new BadRequestException("Subscription is null");
        }

        boolean canAccess = subscriptionService.canAccessMoreChapters(subscription);
        if (!canAccess) {
            throw new BadRequestException("Can't access subscription");
        }

        Purchase purchase = Purchase.builder()
                .user(user)
                .chapter(chapter)
                .accessChapterType(AccessChapterType.SUBSCRIPTION)
                .amount(0L)
                .build();

        purchaseRepository.save(purchase);
        subscriptionService.consumeChapters(subscription);
    }

    @Override
    public List<Purchase> getMyPurchases() {
        User user = getCurrentUser();
        return purchaseRepository.findByUserId(user.getId());
    }

    @Override
    public Purchase getPurchase(User user, Chapter chapter) {
        return purchaseRepository.findByUserAndChapter(user, chapter)
                .orElse(null);
    }

    @Override
    public List<UUID> getPurchasedChapterIds() {
        User user = getCurrentUser();
        return purchaseRepository.findByUserId(user.getId())
                .stream()
                .map(purchase -> purchase.getChapter().getId())
                .toList();
    }
}
