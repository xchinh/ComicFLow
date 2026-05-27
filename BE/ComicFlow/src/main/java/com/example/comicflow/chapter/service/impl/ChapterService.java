package com.example.comicflow.chapter.service.impl;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.mapper.ChapterMapper;
import com.example.comicflow.chapter.repository.ChapterRepository;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.service.IComicService;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.storage.service.IMinioService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ChapterService implements IChapterService {
    private final ChapterMapper chapterMapper;
    private final ChapterRepository chapterRepository;
    private final IComicService comicService;
    private final IMinioService minioService;

    @Override
    public ChapterResponse create(ChapterRequest request) {
        Comic comic = comicService.findById(request.getComicId());

        Chapter chapter = chapterMapper.toChapterResponsePaid(request);
        String pdfUrl = minioService.uploadChapterPdf(comic.getId(), chapter.getId(), request.getFile(), chapter.isFree());
        chapter.setComic(comic);
        chapter.setPdfUrl(pdfUrl);
        Chapter savedChapter = chapterRepository.save(chapter);

        return chapterMapper.toChapterResponse(savedChapter);
    }

    @Override
    public List<ChapterResponse> getChapterByComic(UUID comicId) {
        Comic comic = comicService.findById(comicId);

        return chapterRepository.findByComicIdOrderByChapterNumberAsc(comic.getId())
                .stream()
                .map(chapterMapper::toChapterResponse)
                .toList();
    }

    @Override
    public ChapterResponse getChapterById(UUID id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Chapter not found"));

        if  (chapter.isFree()) {
            return chapterMapper.toChapterResponse(chapter);
        }
        String url = minioService.getPaidChapterUrl(chapter.getPdfUrl());
        return chapterMapper.toChapterResponsePaid(chapter, url);
    }
}
