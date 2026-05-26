package com.example.comicflow.chapter.controller;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ChapterController {

    private final IChapterService chapterService;

    @PostMapping(
            value = "/author/chapters",
            consumes = "multipart/form-data"
    )
    public ApiResponse<ChapterResponse> create(@RequestBody @Valid ChapterRequest request) {
        ChapterResponse response = chapterService.create(request);

        return ApiResponse.success("Chapter created successfully", response);
    }

    @GetMapping("/comics/{comicId}/chapters")
    public ApiResponse<List<ChapterResponse>> getAll(@PathVariable UUID comicId) {
        List<ChapterResponse> response = chapterService.getChapterByComic(comicId);

        return ApiResponse.success("Chapters retrieved successfully", response);
    }

    @GetMapping("/chapters/{chapterId}")
    public ApiResponse<ChapterResponse> get(@PathVariable UUID chapterId) {
        ChapterResponse response = chapterService.getChapterById(chapterId);
        return ApiResponse.success("Chapter retrieved with chapter id successfully", response);
    }
}
