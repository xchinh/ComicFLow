package com.example.comicflow.payment.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoIpnRequest {
    String orderId;

    String requestId;

    Long amount;

    String message;

    Integer resultCode;

    String signature;
}
