package com.example.comicflow.chapter.controller;

import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ChapterControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IChapterService chapterService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void getChapterByComic_ReturnsList() throws Exception {
        UUID comicId = UUID.randomUUID();
        ChapterResponse chapter = new ChapterResponse();
        chapter.setId(UUID.randomUUID());
        chapter.setTitle("IT Chapter");
        chapter.setChapterNumber(1);

        when(chapterService.getChapterByComic(any(UUID.class))).thenReturn(List.of(chapter));

        mockMvc.perform(get("/comics/" + comicId + "/chapters")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("IT Chapter"));
    }

    @Test
    @WithMockUser
    void getChapterById_ReturnsChapter() throws Exception {
        UUID chapterId = UUID.randomUUID();
        ChapterResponse chapter = new ChapterResponse();
        chapter.setId(chapterId);
        chapter.setTitle("IT Chapter 1");
        chapter.setChapterNumber(1);

        when(chapterService.getChapterById(any(UUID.class))).thenReturn(chapter);

        mockMvc.perform(get("/chapters/" + chapterId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("IT Chapter 1"));
    }
}
