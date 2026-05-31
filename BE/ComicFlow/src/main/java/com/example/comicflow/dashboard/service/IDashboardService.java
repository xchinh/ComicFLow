package com.example.comicflow.dashboard.service;

import com.example.comicflow.dashboard.dto.response.AuthorDashboardResponse;
import com.example.comicflow.dashboard.dto.response.DashboardResponse;

public interface IDashboardService {
    DashboardResponse getStats();
    AuthorDashboardResponse getAuthorStats();
}
