package com.example.comicflow.payment.service.impl;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.entity.Payment;
import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.enums.PaymentTargetType;
import com.example.comicflow.payment.repository.PaymentRepository;
import com.example.comicflow.payment.service.IPaymentService;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.subscription.service.ISubscriptionService;
import com.example.comicflow.user.entity.User;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final IPurchaseService purchaseService;
    private final IChapterService chapterService;
    private final ISubscriptionService subscriptionService;
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
    public MomoCreatePayment createChapterPayment(UUID chapterId) throws Exception {
        User currentUser = getCurrentUser();

        Chapter chapter = chapterService.findById(chapterId);

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();

        Long amount = chapter.getPrice();
        String orderInfo = "Purchase Chapter " + chapter.getChapterNumber();
        String extraDataJson = "{\"orderId\":\"" + orderId + "\"}" ;
        String extraData = Base64.getEncoder().encodeToString(extraDataJson.getBytes(StandardCharsets.UTF_8));

        String payUrl = getPayUrl(orderId, requestId, amount, orderInfo, extraData);

        Payment payment = Payment.builder()
                .orderId(orderId)
                .requestId(requestId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .targetType(PaymentTargetType.CHAPTER)
                .paymentMethod("MOMO")
                .user(currentUser)
                .chapter(chapter)
                .build();

        paymentRepository.save(payment);

        return new MomoCreatePayment(payUrl);
    }

    private String getPayUrl(String orderId, String requestId, Long amount, String orderInfo, String extraData) throws Exception {
        String signature = buildSignature(amount, orderId, orderInfo, requestId, extraData);
        Map<String, Object> body = buildBody(orderId, requestId, amount, orderInfo, extraData ,signature);

        try {
            Map<String, Object> response = webClient.post()
                    .uri(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            System.out.println("response: \n" + response);
            if (response == null) {
                throw new BadRequestException("Create Payment With MoMo Failed");
            }
            return response.get("payUrl").toString();

        } catch (WebClientResponseException e) {
            throw new BadRequestException("Create Payment With MoMo Failed" + e.getMessage());
        }
    }

    public MomoCreatePayment createSubscriptionPayment(UUID planId) throws Exception {
        User currentUser = getCurrentUser();

        SubscriptionPlan plan = subscriptionService.findById(planId);

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        Long amount = plan.getPrice();
        String orderInfo = "Purchase Subscription " + plan.getName();
        String extraDataJson = "{\"orderId\":\"" + orderId + "\"}" ;
        String extraData = Base64.getEncoder().encodeToString(extraDataJson.getBytes(StandardCharsets.UTF_8));
        String payUrl = getPayUrl(orderId, requestId, amount, orderInfo, extraData);

        Payment payment = Payment.builder()
                .orderId(orderId)
                .requestId(requestId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .targetType(PaymentTargetType.SUBSCRIPTION)
                .paymentMethod("MOMO")
                .user(currentUser)
                .subscriptionPlan(plan)
                .build();

        paymentRepository.save(payment);


        return new MomoCreatePayment(payUrl);
    }

    @Override
    @Transactional
    public void handleIpn(MomoIpnRequest ipnRequest) {
        Payment payment = paymentRepository.findByOrderIdWithJoin(ipnRequest.getOrderId())
                .orElseThrow(() -> new NotFoundException("Payment Not Found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS || payment.getStatus() == PaymentStatus.FAILED) {
            return;
        }

        if (ipnRequest.getResultCode() == 0) {
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            switch (payment.getTargetType()) {
                case CHAPTER:
                    purchaseService.fulfillPurchase(payment.getUser(), payment.getChapter());
                    break;
                case SUBSCRIPTION:
                    subscriptionService.activateSubscription(
                            payment.getUser(),
                            payment.getSubscriptionPlan()
                    );
                    break;
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
    }

    private String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);

        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : rawHmac) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

     private String buildSignature(
            Long amount,
            String orderId,
            String orderInfo,
            String requestId,
            String extraData
    ) throws Exception {
        String requestType = "captureWallet";

         String rawSignature =
                 "accessKey=" + accessKey +
                         "&amount=" + amount +
                         "&extraData=" + extraData +
                         "&ipnUrl=" + ipnUrl +
                         "&orderId=" + orderId +
                         "&orderInfo=" + orderInfo +
                         "&partnerCode=" + partnerCode +
                         "&redirectUrl=" + redirectUrl +
                         "&requestId=" + requestId +
                         "&requestType=" + requestType;

         System.out.println("================= MOMO DEBUG =================");
         System.out.println("RAW SIGNATURE :\n" + rawSignature);
         System.out.println("==============================================");
        return hmacSha256(rawSignature, secretKey);
    }

    private Map<String, Object> buildBody(
            String orderId,
            String requestId,
            Long amount,
            String orderInfo,
            String extraData,
            String signature
    ) {

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("partnerCode", partnerCode);

        body.put("partnerName", "Comic Platform");
        body.put("storeId", "ComicPlatform");
        body.put("requestId", requestId);

        body.put("amount", amount);

        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", redirectUrl);
        body.put("ipnUrl", ipnUrl);

        body.put("lang", "vi");
        body.put("extraData", extraData);
        body.put("requestType", "captureWallet");
        body.put("signature", signature);

        return body;
    }
}
