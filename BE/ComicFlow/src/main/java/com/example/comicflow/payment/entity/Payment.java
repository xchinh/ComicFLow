package com.example.comicflow.payment.entity;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.common.base.BaseEntity;
import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.enums.PaymentTargetType;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    String orderId;

    String requestId;

    Long amount;

    @Enumerated(EnumType.STRING)
    PaymentStatus status;

    String paymentMethod;

    @Enumerated(EnumType.STRING)
    PaymentTargetType targetType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriptionPlanId")
    SubscriptionPlan subscriptionPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapterId")
    Chapter chapter;
}
