package com.example.comicflow.comic.service;

import com.example.comicflow.comic.dto.request.ComicRequest;
import com.example.comicflow.comic.dto.request.ComicUpdate;
import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.entity.Comic;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

public interface IComicService {
    public ComicResponse create(ComicRequest request, MultipartFile coverImage);
    public List<ComicResponse> getAllComics();
    public ComicResponse getComicById(UUID id);
    public List<ComicResponse> getMyComics();
    public ComicResponse updateComic(UUID comicId, ComicUpdate update);
    public ComicResponse updateComicCover(UUID comicId, String coverImageUrl);
    public void deleteComic(UUID id);

    public Comic findById(UUID id);
}
