package com.example.comicflow.chapter.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChapterResponse {

    UUID id;

    String title;

    Integer chapterNumber;

    Integer price;

    String url;

    UUID comicId;

    LocalDateTime createdAt;
}
