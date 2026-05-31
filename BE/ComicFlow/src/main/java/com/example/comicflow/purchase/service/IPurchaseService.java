package com.example.comicflow.purchase.service;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.purchase.entity.Purchase;
import com.example.comicflow.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface IPurchaseService {
    void fulfillPurchase(User user, Chapter chapter);

    boolean hasAccess(User user, Chapter chapter);

    void unlockViaSubscription(User user, Chapter chapter);

    List<Purchase> getMyPurchases();

    Purchase getPurchase(User user, Chapter chapter);

    List<UUID> getPurchasedChapterIds();
}
