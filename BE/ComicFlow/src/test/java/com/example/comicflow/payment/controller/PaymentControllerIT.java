package com.example.comicflow.payment.controller;

import com.example.comicflow.payment.dto.response.MomoCreatePayment;
import com.example.comicflow.payment.dto.response.PaymentResponse;
import com.example.comicflow.payment.enums.PaymentStatus;
import com.example.comicflow.payment.enums.PaymentTargetType;
import com.example.comicflow.payment.service.IPaymentService;
import com.example.comicflow.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PaymentControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPaymentService paymentService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createPayment_ReturnsUrl() throws Exception {
        UUID chapterId = UUID.randomUUID();
        MomoCreatePayment response = new MomoCreatePayment("http://momo.vn/pay");

        when(paymentService.createChapterPayment(any(UUID.class))).thenReturn(response);

        mockMvc.perform(post("/payments/momo/chapter/" + chapterId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.payUrl").value("http://momo.vn/pay"));
    }

    @Test
    @WithMockUser
    void getPaymentHistory_ReturnsList() throws Exception {
        PaymentResponse history = PaymentResponse.builder()
                .id(UUID.randomUUID())
                .orderId("order123")
                .amount(1000L)
                .status(PaymentStatus.SUCCESS)
                .targetType(PaymentTargetType.CHAPTER)
                .targetName("Chapter 1")
                .createdAt(LocalDateTime.now())
                .build();

        when(paymentService.getPaymentHistory()).thenReturn(List.of(history));

        mockMvc.perform(get("/payments/history")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].orderId").value("order123"));
    }
}
