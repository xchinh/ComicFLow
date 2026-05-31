package com.example.comicflow.purchase.repository;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.purchase.entity.Purchase;
import com.example.comicflow.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {

    boolean existsByUserAndChapter(User user, Chapter chapter);
    List<Purchase> findByUserId(UUID userId);
    Optional<Purchase> findByUserAndChapter(User user, Chapter chapter);

    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.chapter.comic.id = :comicId")
    long countByComicId(@Param("comicId") UUID comicId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Purchase p WHERE p.chapter.comic.id = :comicId")
    long sumAmountByComicId(@Param("comicId") UUID comicId);
}
