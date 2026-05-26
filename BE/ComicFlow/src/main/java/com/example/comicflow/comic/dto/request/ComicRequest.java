package com.example.comicflow.comic.dto.request;

import com.example.comicflow.comic.enums.ComicStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComicRequest {
    @NotBlank
    String title;

    String description;

    @NotNull
    ComicStatus  status;
}
