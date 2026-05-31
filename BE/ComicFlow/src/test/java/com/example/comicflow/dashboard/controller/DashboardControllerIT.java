package com.example.comicflow.dashboard.controller;

import com.example.comicflow.dashboard.dto.response.AuthorDashboardResponse;
import com.example.comicflow.dashboard.dto.response.DashboardResponse;
import com.example.comicflow.dashboard.service.IDashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IDashboardService dashboardService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getStats_Admin_ReturnsSuccess() throws Exception {
        DashboardResponse stats = DashboardResponse.builder()
                .totalUsers(100)
                .totalComics(50)
                .totalRevenue(1000)
                .totalSubscriptions(10)
                .build();

        when(dashboardService.getStats()).thenReturn(stats);

        mockMvc.perform(get("/dashboard/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Dashboard stats fetched successfully"))
                .andExpect(jsonPath("$.data.totalUsers").value(100))
                .andExpect(jsonPath("$.data.totalComics").value(50));
    }

    @Test
    @WithMockUser(roles = "AUTHOR")
    void getAuthorStats_Author_ReturnsSuccess() throws Exception {
        AuthorDashboardResponse stats = AuthorDashboardResponse.builder()
                .totalComics(5)
                .totalViews(500)
                .totalSales(100)
                .comicStats(Collections.emptyList())
                .build();

        when(dashboardService.getAuthorStats()).thenReturn(stats);

        mockMvc.perform(get("/dashboard/author/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Author dashboard stats fetched successfully"))
                .andExpect(jsonPath("$.data.totalComics").value(5))
                .andExpect(jsonPath("$.data.totalViews").value(500));
    }

    @Test
    @WithMockUser(roles = "READER")
    void getStats_Reader_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/dashboard/admin/stats"))
                .andExpect(status().isForbidden());
    }
}
