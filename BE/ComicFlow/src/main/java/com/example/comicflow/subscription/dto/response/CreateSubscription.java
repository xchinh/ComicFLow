package com.example.comicflow.subscription.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateSubscription {
    UUID id;

    String planName;

    LocalDateTime startTime;

    LocalDateTime endTime;
}
