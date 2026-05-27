package com.example.comicflow.payment.service;

import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;

import java.util.UUID;

public interface IPaymentService {
    MomoCreatePayment createPayment(UUID chapterId) throws Exception;

    void handleIpn(MomoIpnRequest ipnRequest);
}
