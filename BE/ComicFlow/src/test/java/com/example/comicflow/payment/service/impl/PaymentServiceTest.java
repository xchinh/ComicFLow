package com.example.comicflow.payment.service.impl;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.payment.dto.request.MomoIpnRequest;
import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.dto.response.PaymentResponse;
import com.example.comicflow.payment.entity.Payment;
import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.enums.PaymentTargetType;
import com.example.comicflow.payment.repository.PaymentRepository;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.subscription.entity.SubscriptionPlan;
import com.example.comicflow.subscription.service.ISubscriptionService;
import com.example.comicflow.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private IPurchaseService purchaseService;
    @Mock
    private IChapterService chapterService;
    @Mock
    private ISubscriptionService subscriptionService;
    @Mock
    private WebClient webClient;
    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;
    @Mock
    private WebClient.RequestBodySpec requestBodySpec;
    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;
    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private PaymentService paymentService;

    private User testUser;
    private Chapter testChapter;
    private SubscriptionPlan testPlan;
    private Payment testPayment;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(UUID.randomUUID()).username("testuser").build();
        testChapter = Chapter.builder().id(UUID.randomUUID()).chapterNumber(1).price(1000L).build();
        testPlan = SubscriptionPlan.builder().id(UUID.randomUUID()).name("Pro Plan").price(50000L).build();
        testPayment = Payment.builder()
                .id(UUID.randomUUID())
                .orderId("order123")
                .amount(1000L)
                .status(PaymentStatus.PENDING)
                .user(testUser)
                .chapter(testChapter)
                .targetType(PaymentTargetType.CHAPTER)
                .build();

        ReflectionTestUtils.setField(paymentService, "partnerCode", "MOMO");
        ReflectionTestUtils.setField(paymentService, "accessKey", "access");
        ReflectionTestUtils.setField(paymentService, "secretKey", "secret");
        ReflectionTestUtils.setField(paymentService, "endpoint", "http://momo.vn");
        ReflectionTestUtils.setField(paymentService, "redirectUrl", "http://redirect.com");
        ReflectionTestUtils.setField(paymentService, "ipnUrl", "http://ipn.com");
        ReflectionTestUtils.setField(paymentService, "webClient", webClient);
    }

    @Test
    void createChapterPayment_Success() throws Exception {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(chapterService.findById(any(UUID.class))).thenReturn(testChapter);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("payUrl", "http://momo.vn/pay");
            
            when(webClient.post()).thenReturn(requestBodyUriSpec);
            when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
            when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
            when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.bodyToMono(any(org.springframework.core.ParameterizedTypeReference.class))).thenReturn(Mono.just(responseMap));

            MomoCreatePayment result = paymentService.createChapterPayment(testChapter.getId());

            assertNotNull(result);
            assertEquals("http://momo.vn/pay", result.getPayUrl());
            verify(paymentRepository, times(1)).save(any(Payment.class));
        }
    }

    @Test
    void handleIpn_Success_Chapter() {
        MomoIpnRequest ipnRequest = new MomoIpnRequest();
        ipnRequest.setOrderId("order123");
        ipnRequest.setResultCode(0);

        when(paymentRepository.findByOrderIdWithJoin(anyString())).thenReturn(Optional.of(testPayment));

        paymentService.handleIpn(ipnRequest);

        assertEquals(PaymentStatus.SUCCESS, testPayment.getStatus());
        verify(purchaseService, times(1)).fulfillPurchase(any(), any());
        verify(paymentRepository, times(1)).save(testPayment);
    }

    @Test
    void handleIpn_Failed() {
        MomoIpnRequest ipnRequest = new MomoIpnRequest();
        ipnRequest.setOrderId("order123");
        ipnRequest.setResultCode(99);

        when(paymentRepository.findByOrderIdWithJoin(anyString())).thenReturn(Optional.of(testPayment));

        paymentService.handleIpn(ipnRequest);

        assertEquals(PaymentStatus.FAILED, testPayment.getStatus());
        verify(paymentRepository, times(1)).save(testPayment);
    }

    @Test
    void getPaymentHistory_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(paymentRepository.findByUserIdWithJoin(any())).thenReturn(List.of(testPayment));

            List<PaymentResponse> result = paymentService.getPaymentHistory();

            assertFalse(result.isEmpty());
            assertEquals("order123", result.get(0).getOrderId());
        }
    }
}
