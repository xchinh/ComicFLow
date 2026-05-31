package com.example.comicflow.chapter.service.impl;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.mapper.ChapterMapper;
import com.example.comicflow.chapter.repository.ChapterRepository;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.service.IComicService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.storage.service.IMinioService;
import com.example.comicflow.subscription.entity.Subscription;
import com.example.comicflow.subscription.service.ISubscriptionService;
import com.example.comicflow.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChapterServiceTest {

    @Mock
    private ChapterMapper chapterMapper;
    @Mock
    private ChapterRepository chapterRepository;
    @Mock
    private IComicService comicService;
    @Mock
    private IMinioService minioService;
    @Mock
    private IPurchaseService purchaseService;
    @Mock
    private ISubscriptionService subscriptionService;

    @InjectMocks
    private ChapterService chapterService;

    private User testUser;
    private Comic testComic;
    private Chapter testChapter;
    private ChapterRequest chapterRequest;
    private ChapterResponse chapterResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(UUID.randomUUID()).username("testuser").build();
        testComic = Comic.builder().id(UUID.randomUUID()).title("Test Comic").author(testUser).build();
        testChapter = Chapter.builder().id(UUID.randomUUID()).chapterNumber(1).title("Chapter 1").price(10L).comic(testComic).isFree(false).build();
        
        chapterRequest = new ChapterRequest();
        chapterRequest.setComicId(testComic.getId());
        chapterRequest.setChapterNumber(1);
        chapterRequest.setTitle("Chapter 1");
        chapterRequest.setPrice(10);
        chapterRequest.setFile(mock(MultipartFile.class));

        chapterResponse = new ChapterResponse();
        chapterResponse.setId(testChapter.getId());
        chapterResponse.setChapterNumber(1);
        chapterResponse.setTitle("Chapter 1");
    }

    @Test
    void createChapter_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(comicService.findById(any(UUID.class))).thenReturn(testComic);
            when(chapterMapper.toChapter(any(ChapterRequest.class))).thenReturn(testChapter);
            when(chapterRepository.save(any(Chapter.class))).thenReturn(testChapter);
            when(minioService.uploadChapterPdf(any(), any(), any(), anyBoolean())).thenReturn("pdfUrl");
            when(chapterMapper.toChapterResponse(any(Chapter.class))).thenReturn(chapterResponse);

            ChapterResponse result = chapterService.create(chapterRequest);

            assertNotNull(result);
            assertEquals(chapterResponse.getTitle(), result.getTitle());
            verify(chapterRepository, times(2)).save(any(Chapter.class));
        }
    }

    @Test
    void createChapter_NotAuthor_ThrowsBadRequestException() {
        User otherUser = User.builder().id(UUID.randomUUID()).build();
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(otherUser);
            when(comicService.findById(any(UUID.class))).thenReturn(testComic);

            assertThrows(BadRequestException.class, () -> chapterService.create(chapterRequest));
        }
    }

    @Test
    void getChapterByComic_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(comicService.findById(any(UUID.class))).thenReturn(testComic);
            when(subscriptionService.getActiveSubscriptionOptional(any(User.class))).thenReturn(Optional.empty());
            when(chapterRepository.findByComicIdOrderByChapterNumberAsc(any(UUID.class))).thenReturn(List.of(testChapter));
            when(chapterMapper.toChapterResponse(any(Chapter.class))).thenReturn(chapterResponse);
            when(purchaseService.hasAccess(any(User.class), any(Chapter.class))).thenReturn(true);

            List<ChapterResponse> result = chapterService.getChapterByComic(testComic.getId());

            assertFalse(result.isEmpty());
            assertTrue(result.get(0).getUnlocked());
        }
    }

    @Test
    void getChapterById_Success_FreeChapter() {
        testChapter.setFree(true);
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(chapterRepository.findById(any(UUID.class))).thenReturn(Optional.of(testChapter));
            when(chapterMapper.toChapterResponse(any(Chapter.class))).thenReturn(chapterResponse);

            ChapterResponse result = chapterService.getChapterById(testChapter.getId());

            assertNotNull(result);
            assertTrue(result.getUnlocked());
        }
    }

    @Test
    void getChapterById_Success_PaidChapter_HasAccess() {
        testChapter.setFree(false);
        testChapter.setPdfUrl("pdfUrl");
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(chapterRepository.findById(any(UUID.class))).thenReturn(Optional.of(testChapter));
            when(purchaseService.hasAccess(any(User.class), any(Chapter.class))).thenReturn(true);
            when(minioService.getPaidChapterUrl(anyString())).thenReturn("signedUrl");
            when(chapterMapper.toChapterResponsePaid(any(Chapter.class), anyString())).thenReturn(chapterResponse);

            ChapterResponse result = chapterService.getChapterById(testChapter.getId());

            assertNotNull(result);
            verify(purchaseService, never()).unlockViaSubscription(any(), any());
        }
    }

    @Test
    void getChapterById_NotFound_ThrowsNotFoundException() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            when(chapterRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

            assertThrows(NotFoundException.class, () -> chapterService.getChapterById(UUID.randomUUID()));
        }
    }
}
