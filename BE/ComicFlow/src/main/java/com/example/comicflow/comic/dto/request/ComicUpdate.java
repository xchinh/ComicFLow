package com.example.comicflow.comic.dto.request;


import com.example.comicflow.comic.enums.ComicStatus;
import lombok.Data;

@Data
public class ComicUpdate {
    String title;
    String description;
    ComicStatus status;
}
