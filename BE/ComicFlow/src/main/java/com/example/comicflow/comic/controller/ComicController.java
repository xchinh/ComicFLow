package com.example.comicflow.comic.controller;

import com.example.comicflow.comic.dto.request.ComicRequest;
import com.example.comicflow.comic.dto.request.ComicUpdate;
import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.service.IComicService;
import com.example.comicflow.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ComicController {
    private final IComicService comicService;

    @PostMapping(value = "/author/comics", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ComicResponse> createComic(
            @RequestPart("comic") @Valid ComicRequest request,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        ComicResponse response = comicService.create(request, coverImage);
        return ApiResponse.success("Comic created successfully", response);
    }

    @GetMapping("/comics")
    public ApiResponse<List<ComicResponse>> getAllComics() {
        List<ComicResponse> response = comicService.getAllComics();
        return ApiResponse.success("Comics retrieved successfully", response);
    }

    @GetMapping("/comics/{comicId}")
    public ApiResponse<ComicResponse> getComic(@PathVariable UUID comicId) {
        ComicResponse response = comicService.getComicById(comicId);
        return ApiResponse.success("Comic retrieved successfully", response);
    }

    @GetMapping("/author/comics")
    public ApiResponse<List<ComicResponse>> getMyComics() {
        List<ComicResponse> response = comicService.getMyComics();
        return ApiResponse.success("Comics retrieved successfully", response);
    }

    @PatchMapping("/author/comics/{comicId}/cover")
    public ApiResponse<ComicResponse>  updateComicCover(@PathVariable UUID comicId, @RequestBody Map<String, String> body) {
        String coverImageUrl = body.get("coverImageUrl");
        ComicResponse response = comicService.updateComicCover(comicId, coverImageUrl);
        return ApiResponse.success("Comic cover updated successfully", response);
    }

    @PutMapping("/author/comics/{comicId}")
    public ApiResponse<ComicResponse> updateComic(@PathVariable UUID comicId, @RequestBody ComicUpdate request){
        ComicResponse response = comicService.updateComic(comicId, request);
        return ApiResponse.success("Comic updated successfully", response);
    }

    @DeleteMapping("/author/comics/{comicId}")
    public ApiResponse<Void> deleteComic(@PathVariable UUID comicId) {
        comicService.deleteComic(comicId);
        return ApiResponse.success("Comic deleted successfully", null);
    }
}
