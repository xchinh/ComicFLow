package com.example.comicflow.subscription.controller;

import com.example.comicflow.security.JwtService;
import com.example.comicflow.subscription.dto.response.SubscriptionPlanResponse;
import com.example.comicflow.subscription.dto.response.UserSubscriptionResponse;
import com.example.comicflow.subscription.service.ISubscriptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SubscriptionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ISubscriptionService subscriptionService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void getPlans_ReturnsList() throws Exception {
        SubscriptionPlanResponse plan = new SubscriptionPlanResponse();
        plan.setName("Premium");

        when(subscriptionService.getPlans()).thenReturn(List.of(plan));

        mockMvc.perform(get("/subscriptions/plans")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Premium"));
    }

    @Test
    @WithMockUser
    void getMySubscription_ReturnsSubscription() throws Exception {
        UserSubscriptionResponse response = new UserSubscriptionResponse();
        response.setPlanName("Premium");

        when(subscriptionService.getMySubscription()).thenReturn(response);

        mockMvc.perform(get("/subscriptions/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.planName").value("Premium"));
    }
}
