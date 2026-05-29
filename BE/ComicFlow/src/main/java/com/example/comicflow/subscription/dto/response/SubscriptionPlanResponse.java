package com.example.comicflow.subscription.dto.response;

import lombok.Data;

import java.util.UUID;

@Data
public class SubscriptionPlanResponse {
    UUID id;

    String name;

    Long price;

    Integer chapterLimit;

    Integer durationDays;

    Boolean unlimitedAccess;
}
