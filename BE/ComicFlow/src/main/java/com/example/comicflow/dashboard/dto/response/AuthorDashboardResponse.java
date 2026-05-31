package com.example.comicflow.dashboard.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthorDashboardResponse {
    long totalComics;
    long totalViews;
    long totalSales;
    List<ComicStatsResponse> comicStats;
}
