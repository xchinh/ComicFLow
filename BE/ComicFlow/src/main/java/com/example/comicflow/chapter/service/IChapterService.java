package com.example.comicflow.chapter.service;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;

import java.util.List;
import java.util.UUID;

public interface IChapterService {
    public ChapterResponse create(ChapterRequest request);
    public List<ChapterResponse> getChapterByComic(UUID comicId);
    public ChapterResponse getChapterById(UUID id);
}
