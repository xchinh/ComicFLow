package com.example.comicflow.comic.controller;

import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.service.IComicService;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ComicControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IComicService comicService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void getAllComics_ReturnsList() throws Exception {
        ComicResponse comic = ComicResponse.builder()
                .id(UUID.randomUUID())
                .title("Integrated Comic")
                .authorName("admin")
                .build();

        when(comicService.getAllComics()).thenReturn(List.of(comic));

        mockMvc.perform(get("/comics")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("Integrated Comic"));
    }
}
