package com.example.comicflow.dashboard.controller;

import com.example.comicflow.common.response.ApiResponse;
import com.example.comicflow.dashboard.dto.response.AuthorDashboardResponse;
import com.example.comicflow.dashboard.dto.response.DashboardResponse;
import com.example.comicflow.dashboard.service.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final IDashboardService dashboardService;

    @GetMapping("/admin/stats")
    public ApiResponse<DashboardResponse> getStats() {
        DashboardResponse stats = dashboardService.getStats();
        return ApiResponse.success("Dashboard stats fetched successfully", stats);
    }

    @GetMapping("/author/stats")
    public ApiResponse<AuthorDashboardResponse> getAuthorStats() {
        AuthorDashboardResponse stats = dashboardService.getAuthorStats();
        return ApiResponse.success("Author dashboard stats fetched successfully", stats);
    }
}
