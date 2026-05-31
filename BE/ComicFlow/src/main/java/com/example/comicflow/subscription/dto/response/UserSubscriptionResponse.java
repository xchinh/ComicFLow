package com.example.comicflow.subscription.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserSubscriptionResponse {
    UUID id;
    String planName;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Integer chaptersRemaining;
    Boolean isActive;
}
