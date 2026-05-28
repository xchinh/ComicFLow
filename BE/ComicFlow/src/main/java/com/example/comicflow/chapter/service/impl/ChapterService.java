package com.example.comicflow.chapter.service.impl;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.chapter.mapper.ChapterMapper;
import com.example.comicflow.chapter.repository.ChapterRepository;
import com.example.comicflow.chapter.service.IChapterService;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.service.IComicService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.storage.service.IMinioService;
import com.example.comicflow.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Service
@AllArgsConstructor
public class ChapterService implements IChapterService {
    private final ChapterMapper chapterMapper;
    private final ChapterRepository chapterRepository;
    private final IComicService comicService;
    private final IMinioService minioService;
    private final IPurchaseService purchaseService;

    @Override
    @Transactional
    public ChapterResponse create(ChapterRequest request) {
        User author = getCurrentUser();
        Comic comic = comicService.findById(request.getComicId());

        if (!comic.getAuthor().equals(author)) {
            throw new BadRequestException("You are not author of this comic");
        }

        Chapter chapter = chapterMapper.toChapter(request);
        chapter.setComic(comic);
        Chapter savedChapter = chapterRepository.save(chapter);

        String pdfUrl = minioService.uploadChapterPdf(comic.getId(), savedChapter.getId(), request.getFile(), savedChapter.isFree());
        savedChapter.setPdfUrl(pdfUrl);

        savedChapter =  chapterRepository.save(savedChapter);
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
        User user = getCurrentUser();
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Chapter not found"));

        if  (chapter.isFree()) {
            return chapterMapper.toChapterResponse(chapter);
        }
        boolean hasAccess = purchaseService.hasAccess(user, chapter);
        if (!hasAccess) {
            purchaseService.unlockViaSubscription(user, chapter);
        }
        String url = minioService.getPaidChapterUrl(chapter.getPdfUrl());
        return chapterMapper.toChapterResponsePaid(chapter, url);
    }

    @Override
    public Chapter findById(UUID id) {
        return chapterRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Chapter not found"));
    }
}
