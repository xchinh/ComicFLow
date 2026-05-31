package com.example.comicflow.comic.service.impl;

import com.example.comicflow.comic.dto.request.ComicRequest;
import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.mapper.ComicMapper;
import com.example.comicflow.comic.repository.ComicRepository;
import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.storage.service.IMinioService;
import com.example.comicflow.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComicServiceTest {

    @Mock
    private ComicRepository comicRepository;

    @Mock
    private ComicMapper comicMapper;

    @Mock
    private IMinioService minioService;

    @InjectMocks
    private ComicService comicService;

    private User testUser;
    private ComicRequest comicRequest;
    private Comic comic;
    private ComicResponse comicResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(UUID.randomUUID()).username("testuser").build();
        comicRequest = new ComicRequest();
        comicRequest.setTitle("Test Comic");
        
        comic = Comic.builder()
                .id(UUID.randomUUID())
                .title("Test Comic")
                .author(testUser)
                .build();
                
        comicResponse = ComicResponse.builder()
                .id(comic.getId())
                .title("Test Comic")
                .authorName("testuser")
                .build();
    }

    @Test
    void createComic_Success() {
        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(testUser);
            
            when(comicMapper.toComic(any(ComicRequest.class), any(User.class))).thenReturn(comic);
            when(comicRepository.save(any(Comic.class))).thenReturn(comic);
            when(comicMapper.toComicResponse(any(Comic.class))).thenReturn(comicResponse);

            ComicResponse result = comicService.create(comicRequest, null);

            assertEquals(comicResponse.getTitle(), result.getTitle());
            verify(comicRepository, times(1)).save(any(Comic.class));
        }
    }
}
