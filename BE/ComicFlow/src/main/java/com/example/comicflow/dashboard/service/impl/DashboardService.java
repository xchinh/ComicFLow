package com.example.comicflow.dashboard.service.impl;

import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.repository.ComicRepository;
import com.example.comicflow.dashboard.dto.response.AuthorDashboardResponse;
import com.example.comicflow.dashboard.dto.response.ComicStatsResponse;
import com.example.comicflow.dashboard.dto.response.DashboardResponse;
import com.example.comicflow.dashboard.service.IDashboardService;
import com.example.comicflow.payment.repository.PaymentRepository;
import com.example.comicflow.purchase.repository.PurchaseRepository;
import com.example.comicflow.subscription.repository.SubscriptionRepository;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashboardService {
    private final UserRepository userRepository;
    private final ComicRepository comicRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PurchaseRepository purchaseRepository;

    @Override
    public DashboardResponse getStats() {
        long totalUsers = userRepository.count();
        long totalComics = comicRepository.count();
        Long totalRevenue = paymentRepository.sumTotalRevenue();
        long totalSubscriptions = subscriptionRepository.count();

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalComics(totalComics)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0)
                .totalSubscriptions(totalSubscriptions)
                .build();
    }

    @Override
    public AuthorDashboardResponse getAuthorStats() {
        User author = getCurrentUser();
        List<Comic> comics = comicRepository.findByAuthorId(author.getId());

        List<ComicStatsResponse> comicStats = comics.stream().map(comic -> {
            long sales = purchaseRepository.sumAmountByComicId(comic.getId());
            return ComicStatsResponse.builder()
                    .comicId(comic.getId())
                    .title(comic.getTitle())
                    .views(comic.getViews() != null ? comic.getViews() : 0)
                    .sales(sales)
                    .build();
        }).collect(Collectors.toList());

        long totalComics = comics.size();
        long totalViews = comics.stream().mapToLong(c -> c.getViews() != null ? c.getViews() : 0).sum();
        long totalSales = comicStats.stream().mapToLong(ComicStatsResponse::getSales).sum();

        return AuthorDashboardResponse.builder()
                .totalComics(totalComics)
                .totalViews(totalViews)
                .totalSales(totalSales)
                .comicStats(comicStats)
                .build();
    }
}
