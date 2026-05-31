package com.example.comicflow.storage.controller;

import com.example.comicflow.storage.service.IMinioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StorageControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IMinioService minioService;

    @Test
    void uploadCoverImage_ReturnsSuccess() throws Exception {
        UUID comicId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "test data".getBytes());
        String expectedUrl = "http://minio/bucket/comic/cover/test.jpg";

        when(minioService.uploadCoverImage(eq(comicId), any())).thenReturn(expectedUrl);

        mockMvc.perform(multipart("/storage/upload")
                .file(file)
                .param("comicId", comicId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Upload Cover Image Successfully"))
                .andExpect(jsonPath("$.data.coverImageUrl").value(expectedUrl));
    }

    @Test
    void uploadChapterPdf_ReturnsSuccess() throws Exception {
        UUID comicId = UUID.randomUUID();
        UUID chapterId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test data".getBytes());
        String expectedUrl = "http://minio/bucket/comic/chapters/test.pdf";

        when(minioService.uploadChapterPdf(eq(comicId), eq(chapterId), any(), anyBoolean())).thenReturn(expectedUrl);

        mockMvc.perform(multipart("/storage/upload/pdf")
                .file(file)
                .param("comicId", comicId.toString())
                .param("chapterId", chapterId.toString())
                .param("isFree", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Upload Chapter Successfully"))
                .andExpect(jsonPath("$.data.url").value(expectedUrl));
    }
}
