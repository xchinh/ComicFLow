package com.example.comicflow.comic.dto.response;

import com.example.comicflow.comic.enums.ComicStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComicResponse {
    UUID id;

    String title;

    String description;

    String coverImageUrl;

    ComicStatus status;

    String authorName;

    LocalDateTime releaseDate; // created_at
}
