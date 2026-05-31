package com.example.comicflow.payment.dto.response;

import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.enums.PaymentTargetType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    UUID id;
    String orderId;
    Long amount;
    PaymentStatus status;
    String paymentMethod;
    PaymentTargetType targetType;
    String targetName; // Chapter title or Subscription Plan name
    LocalDateTime createdAt;
}
