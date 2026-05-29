package com.example.comicflow.purchase.repository;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.purchase.entity.Purchase;
import com.example.comicflow.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {

    boolean existsByUserAndChapter(User user, Chapter chapter);
    List<Purchase> findByUserId(UUID userId);
    Optional<Purchase> findByUserAndChapter(User user, Chapter chapter);
}
