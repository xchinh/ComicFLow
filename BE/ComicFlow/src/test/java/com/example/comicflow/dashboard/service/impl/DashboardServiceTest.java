package com.example.comicflow.dashboard.service.impl;

import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.repository.ComicRepository;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.dashboard.dto.response.AuthorDashboardResponse;
import com.example.comicflow.dashboard.dto.response.DashboardResponse;
import com.example.comicflow.payment.repository.PaymentRepository;
import com.example.comicflow.purchase.repository.PurchaseRepository;
import com.example.comicflow.subscription.repository.SubscriptionRepository;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ComicRepository comicRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private PurchaseRepository purchaseRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private User testAuthor;

    @BeforeEach
    void setUp() {
        testAuthor = User.builder().id(UUID.randomUUID()).username("author").build();
    }

    @Test
    void getStats_ReturnsCorrectAggregation() {
        when(userRepository.count()).thenReturn(10L);
        when(comicRepository.count()).thenReturn(5L);
        when(paymentRepository.sumTotalRevenue()).thenReturn(1000L);
        when(subscriptionRepository.count()).thenReturn(3L);

        DashboardResponse result = dashboardService.getStats();

        assertEquals(10, result.getTotalUsers());
        assertEquals(5, result.getTotalComics());
        assertEquals(1000, result.getTotalRevenue());
        assertEquals(3, result.getTotalSubscriptions());
    }

    @Test
    void getAuthorStats_ReturnsCorrectAggregation() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testAuthor);
            
            Comic comic = Comic.builder().id(UUID.randomUUID()).title("Test Comic").views(100L).build();
            when(comicRepository.findByAuthorId(testAuthor.getId())).thenReturn(List.of(comic));
            when(purchaseRepository.sumAmountByComicId(comic.getId())).thenReturn(500L);

            AuthorDashboardResponse result = dashboardService.getAuthorStats();

            assertNotNull(result);
            assertEquals(1, result.getTotalComics());
            assertEquals(100, result.getTotalViews());
            assertEquals(500, result.getTotalSales());
            assertEquals(1, result.getComicStats().size());
            assertEquals("Test Comic", result.getComicStats().get(0).getTitle());
        }
    }
}
