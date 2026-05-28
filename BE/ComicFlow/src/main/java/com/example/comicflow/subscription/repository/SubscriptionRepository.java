package com.example.comicflow.subscription.repository;

import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByUserAndActiveTrue(User user);
}
