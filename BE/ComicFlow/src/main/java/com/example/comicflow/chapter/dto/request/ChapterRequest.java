package com.example.comicflow.chapter.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
public class ChapterRequest {
    @NotNull
    Integer chapterNumber;

    @NotNull
    String title;

    @NotNull
    Integer price;

    @NotNull
    UUID comicId;

    boolean isFree;

    @NotNull
    MultipartFile file;
}
