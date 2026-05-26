package com.example.comicflow.comic.dto.response;

import com.example.comicflow.comic.enums.ComicStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ComicResponse {
    UUID id;

    String title;

    String description;

    String coverImageUrl;

    ComicStatus status;

    String authorName;

    LocalDateTime releaseDate; // created_at
}
