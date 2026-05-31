package com.example.comicflow.payment.service;

import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.dto.response.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface IPaymentService {
    MomoCreatePayment createChapterPayment(UUID chapterId) throws Exception;
    MomoCreatePayment createSubscriptionPayment(UUID planId) throws Exception;
    void handleIpn(MomoIpnRequest ipnRequest);
    List<PaymentResponse> getPaymentHistory();
}
