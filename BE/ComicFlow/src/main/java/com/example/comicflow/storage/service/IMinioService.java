package com.example.comicflow.storage.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IMinioService {
    public String uploadCoverImage(UUID comicId, MultipartFile file);
    public String uploadChapterPdf(UUID comicId, UUID chapterId, MultipartFile file, boolean isFree);
    public String getPaidChapterUrl(String pdfUrl);
}
