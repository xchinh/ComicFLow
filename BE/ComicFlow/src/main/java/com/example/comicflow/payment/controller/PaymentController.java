package com.example.comicflow.payment.controller;

import com.example.comicflow.common.response.ApiResponse;
import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.service.IPaymentService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final IPaymentService paymentService;

    @PostMapping("/momo/chapter/{chapterId}")
    public ApiResponse<MomoCreatePayment> createPayment(@PathVariable UUID chapterId) throws Exception {
        MomoCreatePayment momoCreatePayment = paymentService.createChapterPayment(chapterId);

        return ApiResponse.success("Payment Url created", momoCreatePayment);
    }

    @PostMapping("/momo/subscription/{planId}")
    public ApiResponse<MomoCreatePayment> createSubScriptonPayment(@PathVariable UUID planId) throws Exception {
        MomoCreatePayment momoCreatePayment = paymentService.createSubscriptionPayment(planId);

        return ApiResponse.success("Payment Url created", momoCreatePayment);
    }

    @PostMapping("/momo/ipn")
    public void momoIpn(@RequestBody MomoIpnRequest ipnRequest) {
        paymentService.handleIpn(ipnRequest);
    }

}
