package com.example.comicflow.storage.controller;

import com.example.comicflow.common.response.ApiResponse;
import com.example.comicflow.storage.dto.response.UploadChapter;
import com.example.comicflow.storage.dto.response.UploadResponse;
import com.example.comicflow.storage.service.impl.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {

    private final MinioService minioService;

    @PostMapping("/upload")
    public ApiResponse<UploadResponse> upload(@RequestParam("file") MultipartFile file, @RequestParam("comicId") UUID comicId) {
        String url = minioService.uploadCoverImage(comicId, file);
        UploadResponse uploadResponse =
                UploadResponse.builder()
                        .fileName(file.getOriginalFilename())
                        .coverImageUrl(url)
                        .build();
        return ApiResponse.success("Upload Cover Image Successfully", uploadResponse);
    }

    @PostMapping("/upload/pdf")
    public ApiResponse<UploadChapter> uploadChapter(
            @RequestParam("file") MultipartFile file,
            @RequestParam("comicId") UUID comicId,
            @RequestParam("chapterId") UUID chapterId,
            @RequestParam("isFree")  boolean isFree
    ) {
        String url = minioService.uploadChapterPdf(comicId, chapterId, file, isFree);
        UploadChapter response = UploadChapter.builder()
                .url(url)
                .build();

        return ApiResponse.success("Upload Chapter Successfully", response);
    }
}
