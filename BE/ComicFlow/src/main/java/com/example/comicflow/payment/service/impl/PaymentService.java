package com.example.comicflow.payment.service.impl;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.common.exception.UnauthorizedException;
import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.entity.Payment;
import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.repository.PaymentRepository;
import com.example.comicflow.payment.service.IPaymentService;
import com.example.comicflow.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final IPurchaseService purchaseService;
    private final IChapterService chapterService;
    private final WebClient webClient =  WebClient.create();

    @Value("${momo.partner-code}")
    private String partnerCode;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String endpoint;

    @Value("${momo.redirect-url}")
    private String redirectUrl;

    @Value("${momo.ipn-url}")
    private String ipnUrl;

    @Override
    public MomoCreatePayment createPayment(UUID chapterId) throws Exception {
        User currentUser = getCurrentUser();

        Chapter chapter = chapterService.findById(chapterId);

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();

        Long amount = chapter.getPrice();
        String orderInfo = "Purchase chapter: " + chapter.getChapterNumber();

        String requestType = "captureWallet";
        String extraData = "";

        Map<String, String> params = new TreeMap<>();
        params.put("orderId", orderId);
        params.put("orderInfo", orderInfo);
        params.put("requestId", requestId);
        params.put("amount", amount.toString());
        params.put("requestType", requestType);
        params.put("extraData", extraData);
        params.put("accessKey", accessKey);
        params.put("partnerCode", partnerCode);
        params.put("redirectUrl", redirectUrl);
        params.put("ipnUrl", ipnUrl);

        StringJoiner rawSignatureJoiner = new StringJoiner("@");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            rawSignatureJoiner.add(entry.getKey() + "=" + entry.getValue());
        }

        String rawSignature = rawSignatureJoiner.toString();
        String signature = hmacSha256(rawSignature, secretKey);

        String body = """
                {
                    "partnerCode":"%s",
                    "partnerName":"Comic Platform",
                    "storeId":"ComicPlatform",
                    "requestId":"%s",
                    "amount":%d,
                    "orderId":"%s",
                    "orderInfo":"%s",
                    "redirectUrl":"%s",
                    "ipnUrl":"%s",
                    "lang":"vi",
                    "extraData":"",
                    "requestType":"captureWallet",
                    "signature":"%s"
                }
                """.formatted(
                partnerCode,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                signature
        );

        JsonNode response = webClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) {
            throw new BadRequestException("Create Payment With MoMo Failed");
        }

        Payment payment = Payment.builder()
                .orderId(orderId)
                .requestId(requestId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .paymentMethod("MOMO")
                .user(currentUser)
                .chapter(chapter)
                .build();

        paymentRepository.save(payment);

        String payUrl = response.get("payUrl").asString();
        return new MomoCreatePayment(payUrl);
    }

    @Override
    public void handleIpn(MomoIpnRequest ipnRequest) {
        Payment payment = paymentRepository.findByOderId(ipnRequest.getOrderId())
                .orElseThrow(() -> new NotFoundException("Payment Not Found"));

        if (ipnRequest.getResultCode() == 0) {
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            purchaseService.fulfillPurchase(payment.getUser(), payment.getChapter());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
    }

    private String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKey);

        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Hex.encodeHexString(mac.doFinal(rawHmac));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new UnauthorizedException("Unauthorized");
        }

        return  (User) authentication.getPrincipal();
    }
}
