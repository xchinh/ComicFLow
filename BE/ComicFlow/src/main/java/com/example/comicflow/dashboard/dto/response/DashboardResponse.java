package com.example.comicflow.dashboard.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardResponse {
    long totalUsers;
    long totalComics;
    long totalRevenue;
    long totalSubscriptions;
}
